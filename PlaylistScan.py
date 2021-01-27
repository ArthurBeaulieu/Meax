#!/usr/bin/env python3


# Python imports
import os
import sys
import argparse
import shutil
import json
# Mutagen imports
from mutagen.id3 import ID3
from mutagen.flac import FLAC
# Globals
global version
version = '0.0.1'


# Script main frame
def main():
    # Init argparse arguments
    ap = argparse.ArgumentParser()
    ap.add_argument('folder', help='The input folder path to crawl (absolute or relative)')
    # Main modes
    ap.add_argument('-s', '--scan', help='Scan a folder to create a JSON file for web UI', action='store_true')
    ap.add_argument('-m', '--minify', help='Minifies the JSON output to maximize performances', action='store_true')
    args = vars(ap.parse_args())
    # Preventing path from missing its trailing slash (or backslash for win compatibility)
    if not args['folder'].endswith('\\') and not args['folder'].endswith('/'):
        print('  The path \'{}\' is invalid...'.format(args['folder']))
        print('  It must end with a / or an \\, depending on your system\n')
        print('> Exiting PlaylistScan.py')
        sys.exit(-1)
    # Exec script
    print('##----------------------------------------##')
    print('##                                        ##')
    print('##          Meax - version {}          ##'.format(version))
    print('##                                        ##')
    print('##----------------------------------------##\n')
    # Perform a scan for the given folder to output a JSON file
    if args['scan']:
        scanFolder(args)
    else:
        print('  You must provide the -s/--scan argument to the command\n')
        print('> Exiting PlaylistScan.py')


# Will crawl the folder path given in argument, and all its sub-directories
def scanFolder(args):
    folderName = os.path.basename(os.path.normpath(args['folder']))
    # First make a copy of the playlist in website assets, to be easily accessible
    if os.path.exists('./assets/playlist/{}'.format(folderName)):
        print('> Removing previous copy of playlist from assets')
        shutil.rmtree('./assets/playlist/{}'.format(folderName))
    print('> Starting playlist copy in Meax assets folder\n')
    shutil.copytree(args['folder'], './assets/playlist/{}'.format(folderName), copy_function=logCopytree)

    print('\n> Generating JSON output')
    output = {}
    output['tracks'] = []
    # Sort directories so they are handled in the alphabetical order
    for root, directories, files in sorted(os.walk(args['folder'])):
        files = [f for f in files if not f[0] == '.'] # Ignore hidden files
        directories[:] = [d for d in directories if not d[0] == '.'] # ignore hidden directories
        # Split root into an array of folders
        path = root.split(os.sep)
        # Mutagen needs a preserved path when using ID3() or FLAC()
        preservedPath = ''
        for folder in path:  # Build the file path by concatenating folder in the file path
            preservedPath += '{}/'.format(folder)
        # Iterate files to fill output array
        for file in files:
            fileName = os.path.basename(os.path.normpath(file))
            extension = os.path.splitext(fileName)[1].lower()
            if extension == '.flac' or extension == '.mp3':
                trackObject = {}
                trackObject['url'] = './assets/playlist/{}/{}'.format(folderName, file)
                if extension == '.mp3':
                    audioTag = ID3(preservedPath + '{}'.format(file))
                    self._fillFromMP3()
                elif extension == '.flac':
                    audioTag = FLAC(preservedPath + '{}'.format(file))
                    if 'TITLE' in audioTag:
                        trackObject['title'] = audioTag['TITLE'][0]
                    if 'ARTIST' in audioTag:
                        trackObject['artist'] = audioTag['ARTIST'][0]
                    if 'BPM' in audioTag:
                        trackObject['bpm'] = audioTag['BPM'][0]
                    if 'INITIALKEY' in audioTag:
                        trackObject['key'] = audioTag['INITIALKEY'][0]
                output['tracks'].append(trackObject)
    # Dumping JSON file
    filename = './assets/playlist/{}.json'.format(folderName)
    with open(filename, 'w', encoding='utf-8') as file:
        if args['minify']:
            json.dump(output, file, ensure_ascii=False, separators=(',', ':'))
        else:
            json.dump(output, file, ensure_ascii=False, indent=2)
    print('> JSON as been successfully created. Go in ./assets/playlist to retrieve this file')



# Verbose version of copy for shutil
def logCopytree(src, dst):
    fileName = os.path.basename(os.path.normpath(src))
    extension = os.path.splitext(fileName)[1].lower()
    if extension == '.flac' or extension == '.mp3':
        print('  Copying {}'.format(fileName))
        shutil.copy2(src,dst)
    else:
        print('  Ignoring {} (unsupported format for metadata extraction)'.format(fileName))


# Script start point
if __name__ == '__main__':
    main()
