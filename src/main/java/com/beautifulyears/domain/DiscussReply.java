package com.beautifulyears.domain;

import java.util.Date;
import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

//The discuss_comment collection represents comments
@Document(collection = "discuss_replies")
public class DiscussReply {
	
	public static final int REPLY_TYPE_ANSWER=1;
	public static final int REPLY_TYPE_COMMENT=0;
	
	@Id
	private String id;
	private String discussId;

	private String userId;

	private String parentReplyId;

	private List<String> ancestorsId;

	private String replyContent;

	private String userName;

	private int replyType;

	private Date createdAt = new Date();

	private int childrenCount;

	private int directChildrenCount;

	private List<String> likedBy;
	
	private String text;
	
	private Date lastModifiedAt;
	
	
	public Date getLastModifiedAt() {
		return lastModifiedAt;
	}

	public void setLastModifiedAt(Date lastModifiedAt) {
		this.lastModifiedAt = lastModifiedAt;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public int getReplyType() {
		return replyType;
	}

	public void setReplyType(int replyType) {
		this.replyType = replyType;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDiscussId() {
		return discussId;
	}

	public void setDiscussId(String discussId) {
		this.discussId = discussId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getParentReplyId() {
		return parentReplyId;
	}

	public void setParentReplyId(String parentReplyId) {
		this.parentReplyId = parentReplyId;
	}

	public List<String> getAncestorsId() {
		return ancestorsId;
	}

	public void setAncestorsId(List<String> ancestorsId) {
		this.ancestorsId = ancestorsId;
	}

	public String getReplyContent() {
		return replyContent;
	}

	public void setReplyContent(String replyContent) {
		this.replyContent = replyContent;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public int getChildrenCount() {
		return childrenCount;
	}

	public void setChildrenCount(int childrenCount) {
		this.childrenCount = childrenCount;
	}

	public int getDirectChildrenCount() {
		return directChildrenCount;
	}

	public void setDirectChildrenCount(int directChildrenCount) {
		this.directChildrenCount = directChildrenCount;
	}

	public List<String> getLikedBy() {
		return likedBy;
	}

	public void setLikedBy(List<String> likedBy) {
		this.likedBy = likedBy;
	}

}
