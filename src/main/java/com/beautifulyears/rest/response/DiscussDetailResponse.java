/**
 * Jun 23, 2015
 * Nitin
 * 11:49:21 AM
 */
package com.beautifulyears.rest.response;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.codehaus.jackson.annotate.JsonIgnore;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.domain.User;
import com.beautifulyears.rest.DiscussDetailController;

public class DiscussDetailResponse implements IResponse {

	private String id;
	private String title;
	private String articlePhotoFilename;
	private String userId;
	private String username;
	private String discussType; // Q, P and A (Question, Post and Article)
	private String text;
	private int aggrReplyCount;
	private Date createdAt = new Date();
	private List<String> topicId;
	private boolean isLikedByUser = false;
	private int aggrLikeCount = 0;
	private List<DiscussReply> replies = new ArrayList<DiscussReply>();
	
	

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getArticlePhotoFilename() {
		return articlePhotoFilename;
	}

	public void setArticlePhotoFilename(String articlePhotoFilename) {
		this.articlePhotoFilename = articlePhotoFilename;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getDiscussType() {
		return discussType;
	}

	public void setDiscussType(String discussType) {
		this.discussType = discussType;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public int getAggrReplyCount() {
		return aggrReplyCount;
	}

	public void setAggrReplyCount(int aggrReplyCount) {
		this.aggrReplyCount = aggrReplyCount;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public List<String> getTopicId() {
		return topicId;
	}

	public void setTopicId(List<String> topicId) {
		this.topicId = topicId;
	}

	public boolean isLikedByUser() {
		return isLikedByUser;
	}

	public void setLikedByUser(boolean isLikedByUser) {
		this.isLikedByUser = isLikedByUser;
	}

	public int getAggrLikeCount() {
		return aggrLikeCount;
	}

	public void setAggrLikeCount(int aggrLikeCount) {
		this.aggrLikeCount = aggrLikeCount;
	}

	public List<DiscussReply> getReplies() {
		return replies;
	}

	public void setReplies(List<DiscussReply> replies) {
		this.replies = replies;
	}

	@Override
	@JsonIgnore
	public DiscussDetailResponse getResponse() {
		// TODO Auto-generated method stub
		return this;
	}
	
	public void addDiscuss(Discuss discuss){
		id = discuss.getId();
		title = discuss.getTitle();
		articlePhotoFilename = discuss.getArticlePhotoFilename();
		userId = discuss.getUserId();
		username = discuss.getUsername();
		discussType = discuss.getDiscussType();
		text = discuss.getText();
		aggrReplyCount = discuss.getAggrReplyCount();
		createdAt = discuss.getCreatedAt();
		topicId = discuss.getTopicId();
	}
	
	public void addDiscuss(Discuss discuss,User user){
		addDiscuss(discuss);
		if (null != user && discuss.getLikedBy().contains(user.getId())) {
			isLikedByUser = true;
		}
	}

	public void addReplies(List<DiscussReply> replies) {
		Map<String,DiscussReply> tempMap = new HashMap<String, DiscussReply>();
		List<DiscussReply> repliesList = new ArrayList<DiscussReply>();
		for (DiscussReply discussReply : replies) {
			tempMap.put(discussReply.getId(), discussReply);
			if(null == discussReply.getParentReplyId()){
				repliesList.add(0, discussReply);
			}else if(null != discussReply.getAncestorsId() && discussReply.getAncestorsId().size() > 0){
				DiscussReply parentReply = tempMap.get(discussReply.getAncestorsId().get(discussReply.getAncestorsId().size() - 1));
				if(null != parentReply){
					parentReply.getReplies().add(discussReply);
				}
			}else{
				Logger.getLogger(DiscussDetailResponse.class).debug("improper heirarchy value for reply, hence ignoriing!!");
			}
		}
		setReplies(repliesList);
	}

}
