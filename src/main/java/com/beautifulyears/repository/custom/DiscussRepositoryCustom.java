package com.beautifulyears.repository.custom;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.rest.response.PageImpl;

public interface DiscussRepositoryCustom  {

//	 public Long getSize(String discussType,String topicId,String subTopicId);
	 
//	 public List<Discuss> find(String discussType,String topicId,String subTopicId);
	 
//	 public List<Discuss> findPublished(Map<String, Object>filters,List<String>sort, int count);
	 
	 public PageImpl<Discuss> getPage(List<String> discussTypeArray,
				List<ObjectId> tagIds, String userId, Boolean isFeatured,
				Pageable pageable);
	 
	 public long getCount(List<String> discussTypeArray, List<ObjectId> tagIds,
			String userId, Boolean isFeatured);
}
