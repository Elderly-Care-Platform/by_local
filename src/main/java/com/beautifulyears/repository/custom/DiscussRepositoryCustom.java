package com.beautifulyears.repository.custom;

import java.util.List;
import java.util.Map;

import com.beautifulyears.domain.Discuss;

public interface DiscussRepositoryCustom  {

	 public Long getSize(String discussType,String topicId,String subTopicId);
	 
	 public List<Discuss> find(String discussType,String topicId,String subTopicId);
	 
	 public List<Discuss> findPublished(Map<String, Object>filters,List<String>sort, int count);
}
