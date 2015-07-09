package com.beautifulyears.repository;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.beautifulyears.DiscussConstants;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.repository.custom.DiscussRepositoryCustom;

@Repository
public interface DiscussRepository extends MongoRepository<Discuss, Serializable>, DiscussRepositoryCustom {
	

    public List<Discuss> findAll();
    
    @Query("{ "
    			+ "'$and':["
		    		+ "{'$or':"
						+ "[ {$where: '?0 == null'}, "
							+ "{'discussType':{$in:?0}} "
							+ "] "
						+ "},"
		    		+ "{'$or':"
							+ "[ {$where: '?1.length == 0'}, "
							+ "{'topicId': {$in:?1}} "
							+ "] "
					+ "},"
					+ "{'$or':"
							+ "[ {$where: '?2 == null'}, "
							+ "{'userId':?2} "
							+ "]"
					+ "},"
					+ "{'$or':"
							+ "[ {$where: '?3 == null'}, "
							+ "{'isFeatured':?3} "
							+ "]"
					+ "},"
					+ "{"
							+ "'status': {$in:["+DiscussConstants.DISCUSS_STATUS_ACTIVE+",null]}"
				+ "}"
				+ "]"
			+ "}")
    public Page<Discuss> getByCriteria(List<String> discussType,List<String> topicId,String userId,Boolean isFeatured,Pageable page);
   
}
