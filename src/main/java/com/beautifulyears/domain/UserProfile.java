package com.beautifulyears.domain;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
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
	
	private BasicProfileInfo basicProfileInfo = new BasicProfileInfo(); //contains all common user profile information.

	private IndividualProfileInfo individualInfo = new IndividualProfileInfo(); //contains information applicable to an individual;
	
	private ServiceProviderInfo serviceProviderInfo = new ServiceProviderInfo(); //contains information about service providers
	
	private String tags;

	private boolean isFeatured;
	
	private List<String> systemTags = new ArrayList<String>();

	private List<String> userTags = new ArrayList<String>();
	
	private int status; //Unparroved, verified, etc. 
	
	private List<String> reviewedBy = new ArrayList<String>();
	
	private List<String> ratedBy = new ArrayList<String>();
	
	@Transient
	private Float aggrRating;
	
	
	@JsonProperty
	public Float getAggrRating() {
		return aggrRating;
	}
	@JsonIgnore
	public void setAggrRating(Float aggrRating) {
		this.aggrRating = aggrRating;
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
	
	

	public List<String> getReviewedBy() {
		return reviewedBy;
	}

	public void setReviewedBy(List<String> reviewedBy) {
		this.reviewedBy = reviewedBy;
	}

	public List<String> getRatedBy() {
		return ratedBy;
	}

	public void setRatedBy(List<String> ratedBy) {
		this.ratedBy = ratedBy;
	}

	@Override
	public String toString() {
		return "UserProfile [id=" + id + ", userId=" + userId + ", userTypes="
				+ userTypes + ", basicProfileInfo=" + basicProfileInfo
				+ ", individualInfo=" + individualInfo
				+ ", serviceProviderInfo=" + serviceProviderInfo + ", tags="
				+ tags + ", isFeatured=" + isFeatured + ", systemTags="
				+ systemTags + ", userTags=" + userTags + ", status=" + status
				+ ", reviewedBy=" + reviewedBy + ", ratedBy=" + ratedBy + "]";
	}

	
	

}
