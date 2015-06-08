package com.beautifulyears.domain;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

//The discuss_user_likes collection represents user likes on various discuss
@Document(collection = "discuss_user_likes")
public class DiscussUserLikes {

	String id;
	String userId;
	String discussId;
	String isLike; // "0" or "1": 0 -> does not like, 1 -> likes
	Date createdAt = new Date();

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

	public String getDiscussId() {
		return discussId;
	}

	public void setDiscussId(String discussId) {
		this.discussId = discussId;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public DiscussUserLikes() {

	}

	public DiscussUserLikes(String userId, String discussId, String isLike) {
		super();
		this.userId = userId;
		this.discussId = discussId;
		this.isLike = isLike;

	}

	public String getIsLike() {
		return isLike;
	}

	public void setIsLike(String isLike) {
		this.isLike = isLike;
	}

}
