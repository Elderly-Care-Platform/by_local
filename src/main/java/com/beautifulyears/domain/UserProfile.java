package com.beautifulyears.domain;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.beautifulyears.domain.UserAddress;

/** The UserProfile class specifies profile information of all types of users including 
*  individual and institutions. 
*  Documents corresponding to this class are stored in user_profile collection in MongodB.
*  @author jharana
*/
@Document(collection = "user_profile")
public class UserProfile {

	@Id
	private String id;
	
	private String userId; //primary user ID from User.java

	private String firstName;	//corresponds to company Name in institutions and user first name for individuals. name in 

	private String lastName; //not applicable for institutions
	
	private int sex;	//not applicable for institutions:) 0: female, 1: male.
	
	private List<Integer> userTypes = new ArrayList<Integer>(); // @see @UserTypes.java
	
	private List<String> services = new ArrayList<String>(); 	//not applicable for individual user types.
	
	private boolean homeVisits = false;
	
	private String profileImage;  //in case of individuals it is the profile or it is the company logo.
	
	private String primaryEmail; //the 
	
	private List<String> secondaryEmails = new ArrayList<String>();
	
	private String primaryPhoneNo;
	
	private List<String> secondaryPhoneNos = new ArrayList<String>();
	
	private String website;
	
	private String description; //personal story or professional services description
	
	private List<String> photoGalleryURLs = new ArrayList<String>();
	
	private String tags;

	private boolean isFeatured;
	
	private UserAddress userAddress;
	
	private List<String> systemTags = new ArrayList<String>();

	private List<String> userTags = new ArrayList<String>();
	
	private int status; //Unparroved, verified, etc. 
	
	public UserProfile()
	{
		
	}

	
	public UserProfile(String id, String userId, String firstName,
			String lastName, int sex, List<Integer> userTypes,
			List<String> services, boolean homeVisits, String profileImage,
			String primaryEmail, List<String> secondaryEmails,
			String primaryPhoneNo, List<String> secondaryPhoneNos,
			String website, String description, List<String> photoGalleryURLs,
			String tags, boolean isFeatured, UserAddress userAddress) {
		super();
		this.id = id;
		this.userId = userId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.sex = sex;
		this.userTypes = userTypes;
		this.services = services;
		this.homeVisits = homeVisits;
		this.profileImage = profileImage;
		this.primaryEmail = primaryEmail;
		this.secondaryEmails = secondaryEmails;
		this.primaryPhoneNo = primaryPhoneNo;
		this.secondaryPhoneNos = secondaryPhoneNos;
		this.website = website;
		this.description = description;
		this.photoGalleryURLs = photoGalleryURLs;
		this.tags = tags;
		this.isFeatured = isFeatured;
		this.userAddress = userAddress;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public int getSex() {
		return sex;
	}

	public void setSex(int sex) {
		this.sex = sex;
	}

	public List<Integer> getUserTypes() {
		return userTypes;
	}

	public void setUserTypes(List<Integer> userTypes) {
		this.userTypes = userTypes;
	}

	public List<String> getServices() {
		return services;
	}

	public void setServices(List<String> services) {
		this.services = services;
	}

	public boolean isHomeVisits() {
		return homeVisits;
	}

	public void setHomeVisits(boolean homeVisits) {
		this.homeVisits = homeVisits;
	}

	public String getProfileImage() {
		return profileImage;
	}

	public void setProfileImage(String profileImage) {
		this.profileImage = profileImage;
	}

	public String getPrimaryEmail() {
		return primaryEmail;
	}

	public void setPrimaryEmail(String primaryEmail) {
		this.primaryEmail = primaryEmail;
	}

	public List<String> getSecondaryEmails() {
		return secondaryEmails;
	}

	public void setSecondaryEmails(List<String> secondaryEmails) {
		this.secondaryEmails = secondaryEmails;
	}

	public String getPrimaryPhoneNo() {
		return primaryPhoneNo;
	}

	public void setPrimaryPhoneNo(String primaryPhoneNo) {
		this.primaryPhoneNo = primaryPhoneNo;
	}

	public List<String> getSecondaryPhoneNos() {
		return secondaryPhoneNos;
	}

	public void setSecondaryPhoneNos(List<String> secondaryPhoneNos) {
		this.secondaryPhoneNos = secondaryPhoneNos;
	}

	public String getWebsite() {
		return website;
	}

	public void setWebsite(String website) {
		this.website = website;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<String> getPhotoGalleryURLs() {
		return photoGalleryURLs;
	}

	public void setPhotoGalleryURLs(List<String> photoGalleryURLs) {
		this.photoGalleryURLs = photoGalleryURLs;
	}

	public String getTags() {
		return tags;
	}

	public void setTags(String tags) {
		this.tags = tags;
	}

	public boolean isFeatured() {
		return isFeatured;
	}

	public void setFeatured(boolean isFeatured) {
		this.isFeatured = isFeatured;
	}

	public UserAddress getUserAddress() {
		return userAddress;
	}

	public void setUserAddress(UserAddress userAddress) {
		this.userAddress = userAddress;
	}
	
	
	public List<String> getSystemTags() {
		return systemTags;
	}


	public void setSystemTags(List<String> systemTags) {
		this.systemTags = systemTags;
	}


	public List<String> getUserTags() {
		return userTags;
	}


	public void setUserTags(List<String> userTags) {
		this.userTags = userTags;
	}


	public int getStatus() {
		return status;
	}


	public void setStatus(int status) {
		this.status = status;
	}


	@Override
	public String toString() {
		return "UserProfile [id=" + id + ", userId=" + userId + ", firstName="
				+ firstName + ", lastName=" + lastName + ", sex=" + sex
				+ ", userTypes=" + userTypes + ", services=" + services
				+ ", homeVisits=" + homeVisits + ", profileImage="
				+ profileImage + ", primaryEmail=" + primaryEmail
				+ ", secondaryEmails=" + secondaryEmails + ", primaryPhoneNo="
				+ primaryPhoneNo + ", secondaryPhoneNos=" + secondaryPhoneNos
				+ ", website=" + website + ", description=" + description
				+ ", photoGalleryURLs=" + photoGalleryURLs + ", tags=" + tags
				+ ", isFeatured=" + isFeatured + ", userAddress=" + userAddress
				+ ", systemTags=" + systemTags + ", userTags=" + userTags
				+ ", status=" + status + ", getId()=" + getId()
				+ ", getUserId()=" + getUserId() + ", getFirstName()="
				+ getFirstName() + ", getLastName()=" + getLastName()
				+ ", getSex()=" + getSex() + ", getUserTypes()="
				+ getUserTypes() + ", getServices()=" + getServices()
				+ ", isHomeVisits()=" + isHomeVisits() + ", getProfileImage()="
				+ getProfileImage() + ", getPrimaryEmail()="
				+ getPrimaryEmail() + ", getSecondaryEmails()="
				+ getSecondaryEmails() + ", getPrimaryPhoneNo()="
				+ getPrimaryPhoneNo() + ", getSecondaryPhoneNos()="
				+ getSecondaryPhoneNos() + ", getWebsite()=" + getWebsite()
				+ ", getDescription()=" + getDescription()
				+ ", getPhotoGalleryURLs()=" + getPhotoGalleryURLs()
				+ ", getTags()=" + getTags() + ", isFeatured()=" + isFeatured()
				+ ", getUserAddress()=" + getUserAddress()
				+ ", getSystemTags()=" + getSystemTags() + ", getUserTags()="
				+ getUserTags() + ", getStatus()=" + getStatus()
				+ ", getClass()=" + getClass() + ", hashCode()=" + hashCode()
				+ ", toString()=" + super.toString() + "]";
	}


	

	


}
