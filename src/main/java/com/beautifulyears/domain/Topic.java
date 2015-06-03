package com.beautifulyears.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

//The topic collection represents topics
@Document(collection = "topic")
public class Topic {

	@Id
	private String id;
	private String topicId;
	private String topicTitle;
	private String topicNotes;
	private String topicTags;
	private String topicPosition;
	private String topicFlag;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTopicId() {
		return topicId;
	}
	public void setTopicId(String topicId) {
		this.topicId = topicId;
	}
	public String getTopicTitle() {
		return topicTitle;
	}
	public void setTopicTitle(String topicTitle) {
		this.topicTitle = topicTitle;
	}
	public String getTopicNotes() {
		return topicNotes;
	}
	public void setTopicNotes(String topicNotes) {
		this.topicNotes = topicNotes;
	}
	public String getTopicTags() {
		return topicTags;
	}
	public void setTopicTags(String topicTags) {
		this.topicTags = topicTags;
	}
	public String getTopicPosition() {
		return topicPosition;
	}
	public void setTopicPosition(String topicPosition) {
		this.topicPosition = topicPosition;
	}
	public String getTopicFlag() {
		return topicFlag;
	}
	public void setTopicFlag(String topicFlag) {
		this.topicFlag = topicFlag;
	}
}
