/**
 * 
 */
package com.beautifulyears.domain;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * @author Nitin
 *
 */

@Document(collection = "userActivityStats")
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserActivityStats {

	@Id
	private String id;
	private Date activityTime = new Date();
	/*
	 * can be used to list add cart, or query etc
	 */
	private String activityType;
	private String userId;
	private String currentUserEmailId;
	private String mainEntityId;
	private String subEntityId;
	/*
	 * for search string
	 */
	private String queryString;
	private List<String> filterCriteria;
	/*
	 * used to explaing operation in detail
	 */
	private String details;
	/*
	 * used to list community, listing, or shop
	 */
	private String segment;

	public UserActivityStats(String activityType, String userId,
			String userEmail, String mainEntityId, String subEntityId,
			String queryString, List<String> filterCriteria, String detail,
			String segment) {
		this.activityTime = new Date();
		this.activityType = activityType;
		this.userId = userId;
		this.currentUserEmailId = userEmail;
		this.mainEntityId = mainEntityId;
		this.subEntityId = subEntityId;
		this.queryString = queryString;
		this.filterCriteria = filterCriteria;
		this.details = detail;
		this.segment = segment;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Date getActivityTime() {
		return activityTime;
	}

	public void setActivityTime(Date activityTime) {
		this.activityTime = activityTime;
	}

	public String getActivityType() {
		return activityType;
	}

	public void setActivityType(String activityType) {
		this.activityType = activityType;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getCurrentUserEmailId() {
		return currentUserEmailId;
	}

	public void setCurrentUserEmailId(String currentUserEmailId) {
		this.currentUserEmailId = currentUserEmailId;
	}

	public String getMainEntityId() {
		return mainEntityId;
	}

	public void setMainEntityId(String mainEntityId) {
		this.mainEntityId = mainEntityId;
	}

	public String getSubEntityId() {
		return subEntityId;
	}

	public void setSubEntityId(String subEntityId) {
		this.subEntityId = subEntityId;
	}

	public String getQueryString() {
		return queryString;
	}

	public void setQueryString(String queryString) {
		this.queryString = queryString;
	}

	public List<String> getFilterCriteria() {
		return filterCriteria;
	}

	public void setFilterCriteria(List<String> filterCriteria) {
		this.filterCriteria = filterCriteria;
	}

	public String getDetails() {
		return details;
	}

	public void setDetails(String details) {
		this.details = details;
	}

	public String getSegment() {
		return segment;
	}

	public void setSegment(String segment) {
		this.segment = segment;
	}

}
