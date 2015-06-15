package com.beautifulyears.rest;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.Util;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.DiscussUserLikes;
import com.beautifulyears.domain.User;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.repository.DiscussUserLikesRepository;
import com.beautifulyears.repository.custom.DiscussRepositoryCustom;
import com.beautifulyears.repository.custom.DiscussUserLikesRepositoryCustom;
import com.beautifulyears.rest.response.DiscussResponse;
import com.beautifulyears.rest.response.DiscussResponse.DiscussEntity;

//import com.beautifulyears.domain.UserProfile;

/**
 * /** The REST based service for managing "likes on discuss"
 * 
 * @author jumpstart
 *
 */

@Controller
@RequestMapping("/discusslikes")
public class DiscussUserLikesController {

	private DiscussUserLikesRepository discussUserLikesRepository;
	private DiscussRepository discussRepository;
	private MongoTemplate mongoTemplate;

	@Autowired
	public DiscussUserLikesController(
			DiscussUserLikesRepository discussUserLikesRepository,
			DiscussUserLikesRepositoryCustom discussUserLikesRepositoryCustom,
			DiscussRepository discussRepository,
			DiscussRepositoryCustom discussRepositoryCustom,
			MongoTemplate mongoTemplate) {
		this.discussUserLikesRepository = discussUserLikesRepository;
		this.discussRepository = discussRepository;
		this.mongoTemplate = mongoTemplate;
	}

	// create user - registration
	@RequestMapping(method = RequestMethod.GET, value = "/create/{userId}/{discussId}", produces = { "application/json" })
	@ResponseBody
	public DiscussEntity createNewDiscussUserLike(
			@PathVariable("userId") String userId,
			@PathVariable("discussId") String discussId,HttpServletRequest req) throws Exception {
		System.out.println("NEW DISCUSS USER LIKES");
		Discuss discuss = null;
		try {

			discuss = (Discuss) discussRepository.findOne(discussId);
			DiscussResponse discussResponse = new DiscussResponse();
			if (discuss != null) {

				DiscussUserLikes newDiscussUserLike = null;

				// User has already liked this - so ignore
				if (discuss.getLikedBy().contains(userId)) {

					System.out.println("user " + userId
							+ " has already liked Discuss = " + discussId);

				} else {
					
					System.out
							.println("About to create new discuss user like...");
					// create a new user discuss like
					newDiscussUserLike = new DiscussUserLikes(userId,
							discussId,discussId,"D");
					discussUserLikesRepository.save(newDiscussUserLike);
					discuss.getLikedBy().add(userId);
					discussRepository.save(discuss);

				}
			}
			return discussResponse.getDiscussEntity(discuss, Util.getSessionUser(req));
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
}