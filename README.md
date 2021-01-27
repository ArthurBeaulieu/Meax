# Meax

![](https://badgen.net/badge/version/0.0.1/blue) ![](https://badgen.net/badge/license/GPL-3.0/green)

You own a DDJ-400 from Pioneer? Why not trying to mix with it straight into your browser? No need for a fancy configuration, clone this repo, install dependancies, scan your playlists and mix the sh\*t out of your tracks! This project is meant to be used locally in order to be always fast and available, regardless your internet connection.

You don't own a DDJ-400? Ok, not a problem! DM me so I can learn about your controller (brand and model mostly), and create the mapping file for it!

<p>
  <img src="/assets/demo/Screenshot-2020-10-11.png" width="960" alt="screenshot" />
</p>

## Get started

This project works on Windows, Linux and OSX. To make it work, ensure you've installed  the *famouso* `npm`, `python3` and the python's package `mutagen`. You also need a chroium-based web browser, because of its support for the MIDI API (Firefox, I'm waiting for you). Once those requirements are met, clone this repository, and install node packages using `npm install`. You can now start a local web server to host your Meax instance, using `npm run web-server`. Grab your chromium-based browser at `127.0.0.1:1337` to start the app.

You'll now need to scan your tracks, in order to load them into the user interface. For this, launch the `PlaylistScan.py` script with your playlist path:

`python PlaylistScan.py -s /path/to/playlist/`

For huge playlists, you may use the `--minify` flag to compress the JSON output. The script will copy your tracks into `assets/playlist` directory and will create a JSON file next to it that will make Meax able to use your tracks and their metadata. Back in the browser, click on the *New playlist* button, and drop that JSON file in the planned location. Meax will perform a bpm detection on each playlist's file. Unfortunatly, you'll need to manually fill the key tag in your tracks if you want to retrieve this information in the app (help wanted on that topic). You can now mix!

*NB*: You must ensure that your controller is set as the audio interface of your computer, in order to have an audio feedback in your headphones.

---

[mutagen](https://github.com/quodlibet/mutagen), [AudioVisualizer](https://github.com/ArthurBeaulieu/AudioVisualizer), [BeatDetect.js](https://github.com/ArthurBeaulieu/BeatDetect.js), [CustomEvents.js](https://github.com/ArthurBeaulieu/CustomEvents.js)

Meax - 2020/2021
