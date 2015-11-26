package com.beautifulyears.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.beautifulyears.domain.menu.Tag;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Document(collection = "service_branch")
public class ServiceBranch {
	
	@Id
	private String id;
	
	// primary user ID from User.java
	private String userId;
	
	// contains all common user profile information.
	private BasicProfileInfo basicProfileInfo = new BasicProfileInfo();
	
	// contains information about service provider
	private ServiceProviderInfo serviceProviderInfo = new ServiceProviderInfo();
	
	private String tags;

	private boolean isFeatured;

	private boolean verified;

	private final Date createdAt = new Date();

	private Date lastModifiedAt = new Date();
	@DBRef
	private List<Tag> systemTags = new ArrayList<Tag>();

	private List<String> userTags = new ArrayList<String>();

	private int status; // Unparroved, verified, etc.

	@JsonIgnore
	private List<String> reviewedBy = new ArrayList<String>();

	@JsonIgnore
	private List<String> ratedBy = new ArrayList<String>();

	private Float aggrRatingPercentage = 0f;

	@Transient
	private boolean isReviewedByUser = false;

	@Transient
	private boolean isRatedByUser = false;


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
	

	public BasicProfileInfo getBasicProfileInfo() {
		return basicProfileInfo;
	}

	public void setBasicProfileInfo(BasicProfileInfo basicProfileInfo) {
		this.basicProfileInfo = basicProfileInfo;
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

	public boolean isVerified() {
		return verified;
	}

	public void setVerified(boolean verified) {
		this.verified = verified;
	}

	public Date getLastModifiedAt() {
		return lastModifiedAt;
	}

	public void setLastModifiedAt(Date lastModifiedAt) {
		this.lastModifiedAt = lastModifiedAt;
	}

	public List<Tag> getSystemTags() {
		return systemTags;
	}

	public void setSystemTags(List<Tag> systemTags) {
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

	public Float getAggrRatingPercentage() {
		return aggrRatingPercentage;
	}

	public void setAggrRatingPercentage(Float aggrRatingPercentage) {
		this.aggrRatingPercentage = aggrRatingPercentage;
	}

	public boolean isReviewedByUser() {
		return isReviewedByUser;
	}

	public void setReviewedByUser(boolean isReviewedByUser) {
		this.isReviewedByUser = isReviewedByUser;
	}

	public boolean isRatedByUser() {
		return isRatedByUser;
	}

	public void setRatedByUser(boolean isRatedByUser) {
		this.isRatedByUser = isRatedByUser;
	}

	public Date getCreatedAt() {
		return createdAt;
	}
	
	@Override
	public boolean equals(Object object) {
		boolean isEqual = false;

		if (object != null && object instanceof ServiceBranch) {
			isEqual = this.getId() != null
					&& (this.getId().equals(((ServiceBranch) object).getId()));
		}
		return isEqual;
	}

	@Override
	public int hashCode() {
		assert false : "hashCode not designed";
		return 42;
	}
	
}
