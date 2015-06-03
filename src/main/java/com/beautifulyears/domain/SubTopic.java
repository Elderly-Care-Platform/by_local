package com.beautifulyears.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

//The topic collection represents topics
@Document(collection = "sub_topic")
public class SubTopic {
	@Id
	private String id;
	private String subTopicId;
	private String topicId;
	private String subTopicTitle;
	private String subTopicDescription;
	private String subTopicNotes;
	private String subTopicTags;
	private String subTopicPosition;
	private String subTopicFlag;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getSubTopicId() {
		return subTopicId;
	}

	public void setSubTopicId(String subTopicId) {
		this.subTopicId = subTopicId;
	}

	public String getTopicId() {
		return topicId;
	}

	public void setTopicId(String topicId) {
		this.topicId = topicId;
	}

	public String getSubTopicTitle() {
		return subTopicTitle;
	}

	public void setSubTopicTitle(String subTopicTitle) {
		this.subTopicTitle = subTopicTitle;
	}

	public String getSubTopicDescription() {
		return subTopicDescription;
	}

	public void setSubTopicDescription(String subTopicDescription) {
		this.subTopicDescription = subTopicDescription;
	}

	public String getSubTopicNotes() {
		return subTopicNotes;
	}

	public void setSubTopicNotes(String subTopicNotes) {
		this.subTopicNotes = subTopicNotes;
	}

	public String getSubTopicTags() {
		return subTopicTags;
	}

	public void setSubTopicTags(String subTopicTags) {
		this.subTopicTags = subTopicTags;
	}

	public String getSubTopicPosition() {
		return subTopicPosition;
	}

	public void setSubTopicPosition(String subTopicPosition) {
		this.subTopicPosition = subTopicPosition;
	}

	public String getSubTopicFlag() {
		return subTopicFlag;
	}

	public void setSubTopicFlag(String subTopicFlag) {
		this.subTopicFlag = subTopicFlag;
	}

}
