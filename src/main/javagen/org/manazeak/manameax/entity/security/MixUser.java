package org.manazeak.manameax.entity.security;

import java.io.Serializable;
import javax.persistence.GeneratedValue;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Set;
import javax.persistence.JoinColumn;
import javax.persistence.Column;
import javax.persistence.SequenceGenerator;
import javax.persistence.CascadeType;
import javax.persistence.ManyToMany;
import javax.persistence.Id;
import javax.persistence.GenerationType;
import javax.persistence.JoinTable;

/**
 * A user object.
 *
 * This file has been automatically generated
 */
@Entity
@Table(name="mix_user")
public class MixUser implements Serializable{
	/** Serial ID */
	private static final long serialVersionUID = 1L;

	private Long userId;
	private Boolean isActive;
	private String password;
	private String username;
	private Set<Role> roleList;

    /**
     * No comment found in model diagram
     * @return value of userId
     */
    @Id
    @SequenceGenerator(name="SEQ_MIX_USER", sequenceName="SEQ_MIX_USER", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_MIX_USER")
    @Column(name="user_id", nullable=false)
	public Long getUserId(){
		return userId;
    }  
    /**
     * No comment found in model diagram
     * @param userId new value to give to userId
     */
	public void setUserId(final Long userId){
		this.userId = userId;
    }  
    /**
     * No comment found in model diagram
     * @return value of isActive
     */
    @Column(name="is_active", nullable=false)
	public Boolean getIsActive(){
		return isActive;
    }  
    /**
     * No comment found in model diagram
     * @param isActive new value to give to isActive
     */
	public void setIsActive(final Boolean isActive){
		this.isActive = isActive;
    }  
    /**
     * No comment found in model diagram
     * @return value of password
     */
    @Column(name="password", nullable=false)
	public String getPassword(){
		return password;
    }  
    /**
     * No comment found in model diagram
     * @param password new value to give to password
     */
	public void setPassword(final String password){
		this.password = password;
    }  
    /**
     * No comment found in model diagram
     * @return value of username
     */
    @Column(name="username", nullable=false)
	public String getUsername(){
		return username;
    }  
    /**
     * No comment found in model diagram
     * @param username new value to give to username
     */
	public void setUsername(final String username){
		this.username = username;
    }  
    /**
     * Association roles_user to Role
     * @return value of roleList
     */
    @ManyToMany(cascade={CascadeType.PERSIST,CascadeType.MERGE})
    @JoinTable(name="roles_user", joinColumns=@JoinColumn(name = "user_id"), inverseJoinColumns=@JoinColumn(name = "role_id"))
	public Set<Role> getRoleList(){
		return roleList;
    }  
    /**
     * Association roles_user to Role
     * @param roleList new value to give to roleList
     */
	public void setRoleList(final Set<Role> roleList){
		this.roleList = roleList;
    }  

	@Override
	public int hashCode(){
	 	// Start with a non-zero constant. Prime is preferred
	    int result = 17;
	
		// Calculating hashcode with all "primitives" attributes
		result = 31 * result + (userId == null? 0 : userId.hashCode());
		result = 31 * result + (isActive == null? 0 : isActive.hashCode());
		result = 31 * result + (password == null? 0 : password.hashCode());
		result = 31 * result + (username == null? 0 : username.hashCode());
			
		return result;
	}

	@Override
	public boolean equals(Object other){
		// Null object
	    if(other == null){
	    	return false;
	    }
	
		// Same object
	    if (this == other) {
	        return true;
	    }
	    	
		// Wrong type
	    if (this.getClass() !=  other.getClass()) {
	        return false;
	    }
	
		// Test all "primitives" attributes
	    MixUser otherMixUser = (MixUser) other;
	    
		return (userId == null ?  (otherMixUser.userId == null) : userId.equals(otherMixUser.userId))
			&& (isActive == null ?  (otherMixUser.isActive == null) : isActive.equals(otherMixUser.isActive))
			&& (password == null ?  (otherMixUser.password == null) : password.equals(otherMixUser.password))
			&& (username == null ?  (otherMixUser.username == null) : username.equals(otherMixUser.username))
		;
	}



// END OF GENERATED CODE - YOU CAN EDIT THE FILE AFTER THIS LINE, DO NOT EDIT THIS LINE OR BEFORE THIS LINE
}