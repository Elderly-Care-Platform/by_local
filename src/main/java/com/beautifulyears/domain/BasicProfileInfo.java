package com.beautifulyears.domain;

import java.util.ArrayList;
import java.util.List;
import com.beautifulyears.domain.UserAddress;


/** The BasicProfileInfo class contains basic information of all types of users 
*  Documents corresponding to this class are stored as part of user_profile document in MongodB.
*  @author jharana
*/

public class BasicProfileInfo {

	private String firstName;	//corresponds to company Name in institutions and user first name for individuals. name in 

	private String profileImage;  //in case of individuals it is the profile or it is the company logo.
	
	private String primaryEmail; //the 
	
	private List<String> secondaryEmails = new ArrayList<String>();
	
	private String primaryPhoneNo;
	
	private List<String> secondaryPhoneNos = new ArrayList<String>();	
	
	private String description; //personal story or professional services description
	
	private List<String> photoGalleryURLs = new ArrayList<String>();
	
	private UserAddress userAddress = new UserAddress();

	
	public BasicProfileInfo() {
		
	}
	
	

	public BasicProfileInfo(String firstName, String profileImage,
			String primaryEmail, List<String> secondaryEmails,
			String primaryPhoneNo, List<String> secondaryPhoneNos,
			String description, List<String> photoGalleryURLs,
			UserAddress userAddress) {
		super();
		this.firstName = firstName;
		this.profileImage = profileImage;
		this.primaryEmail = primaryEmail;
		this.secondaryEmails = secondaryEmails;
		this.primaryPhoneNo = primaryPhoneNo;
		this.secondaryPhoneNos = secondaryPhoneNos;
		this.description = description;
		this.photoGalleryURLs = photoGalleryURLs;
		this.userAddress = userAddress;
	}



	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
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

	public UserAddress getUserAddress() {
		return userAddress;
	}

	public void setUserAddress(UserAddress userAddress) {
		this.userAddress = userAddress;
	}

	@Override
	public String toString() {
		return "BasicProfileInfo [firstName=" + firstName + ", profileImage="
				+ profileImage + ", primaryEmail=" + primaryEmail
				+ ", secondaryEmails=" + secondaryEmails + ", primaryPhoneNo="
				+ primaryPhoneNo + ", secondaryPhoneNos=" + secondaryPhoneNos
				+ ", description=" + description + ", photoGalleryURLs="
				+ photoGalleryURLs + ", userAddress=" + userAddress + "]";
	}
	
	
	
}
