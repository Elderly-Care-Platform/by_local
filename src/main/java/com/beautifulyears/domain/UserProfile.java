package com.beautifulyears.domain;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.beautifulyears.domain.BasicProfileInfo;


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
	
	private List<Integer> userTypes = new ArrayList<Integer>(); // @see @UserTypes.java
	
	private BasicProfileInfo basicProfileInfo; //contains all common user profile information.

	private IndividualProfileInfo individualInfo; //contains information applicable to an individual;
	
	private ServiceProviderInfo serviceProviderInfo; //contains information about service providers
	
	private String tags;

	private boolean isFeatured;
	
	private List<String> systemTags = new ArrayList<String>();

	private List<String> userTags = new ArrayList<String>();
	
	private int status; //Unparroved, verified, etc. 
	
	public UserProfile()
	{
		
	}
	
	

	public UserProfile(String id, String userId, List<Integer> userTypes,
			BasicProfileInfo basicProfileInfo,
			IndividualProfileInfo individualInfo,
			ServiceProviderInfo serviceProviderInfo, String tags,
			boolean isFeatured, List<String> systemTags, List<String> userTags,
			int status) {
		super();
		this.id = id;
		this.userId = userId;
		this.userTypes = userTypes;
		this.basicProfileInfo = basicProfileInfo;
		this.individualInfo = individualInfo;
		this.serviceProviderInfo = serviceProviderInfo;
		this.tags = tags;
		this.isFeatured = isFeatured;
		this.systemTags = systemTags;
		this.userTags = userTags;
		this.status = status;
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

	public List<Integer> getUserTypes() {
		return userTypes;
	}

	public void setUserTypes(List<Integer> userTypes) {
		this.userTypes = userTypes;
	}

	public BasicProfileInfo getBasicProfileInfo() {
		return basicProfileInfo;
	}

	public void setBasicProfileInfo(BasicProfileInfo basicProfileInfo) {
		this.basicProfileInfo = basicProfileInfo;
	}

	public IndividualProfileInfo getIndividualInfo() {
		return individualInfo;
	}

	public void setIndividualInfo(IndividualProfileInfo individualInfo) {
		this.individualInfo = individualInfo;
	}

	public ServiceProviderInfo getServiceProviderInfo() {
		return serviceProviderInfo;
	}

	public void setServiceProviderInfo(ServiceProviderInfo serviceProviderInfo) {
		this.serviceProviderInfo = serviceProviderInfo;
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
		return "UserProfile [id=" + id + ", userId=" + userId + ", userTypes="
				+ userTypes + ", basicProfileInfo=" + basicProfileInfo
				+ ", individualInfo=" + individualInfo
				+ ", serviceProviderInfo=" + serviceProviderInfo + ", tags="
				+ tags + ", isFeatured=" + isFeatured + ", systemTags="
				+ systemTags + ", userTags=" + userTags + ", status=" + status
				+ "]";
	}

	

}
