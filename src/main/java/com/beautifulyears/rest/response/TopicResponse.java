package com.beautifulyears.rest.response;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.beautifulyears.domain.Topic;

public class TopicResponse implements IResponse {

	private Map<String, TopicEntity> topicMap = new HashMap<String, TopicEntity>();

	private List<TopicEntity> root;

	private class TopicEntity {
		private String id;
		private String name;
		private String slug;
		private String parentId;

		private List<TopicEntity> children = new ArrayList<TopicResponse.TopicEntity>();

		public TopicEntity(Topic topic) {
			id = topic.getId();
			name = topic.getTopicName();
			slug = topic.getSlug();
			parentId = topic.getParentId();
		}

		public String getParentId() {
			return parentId;
		}

		public void setParentId(String parentId) {
			this.parentId = parentId;
		}

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getSlug() {
			return slug;
		}

		public void setSlug(String slug) {
			this.slug = slug;
		}

		public List<TopicEntity> getChildren() {
			return children;
		}

		public void setChildren(List<TopicEntity> children) {
			this.children = children;
		}

	}

	@Override
	public List<TopicResponse.TopicEntity> getResponse() {
		root = new ArrayList<TopicResponse.TopicEntity>();
		Iterator it = topicMap.entrySet().iterator();
	    while (it.hasNext()) {
	        Map.Entry pair = (Map.Entry)it.next();
	        TopicEntity topic = (TopicEntity) pair.getValue();
	        if(null == topic.getParentId()){
	        	root.add(topic);
	        }else{
	        	topicMap.get(topic.getParentId()).getChildren().add(topic);
	        }
	    }		
		return root;
	}

	public void addTopics(Topic topic) {
		TopicEntity topicRes = new TopicEntity(topic);
		topicMap.put(topic.getId(), topicRes);
	}

	public void addTopics(List<Topic> topicList) {
		for (Iterator<Topic> iterator = topicList.iterator(); iterator
				.hasNext();) {
			Topic topic = (Topic) iterator.next();
			TopicEntity topicRes = new TopicEntity(topic);
			topicMap.put(topic.getId(), topicRes);
		}
	}

}
