package com.beautifulyears.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.DiscussUserLikes;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.repository.DiscussUserLikesRepository;
import com.beautifulyears.repository.custom.DiscussRepositoryCustom;
import com.beautifulyears.repository.custom.DiscussUserLikesRepositoryCustom;

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
	public Discuss createNewDiscussUserLike(
			@PathVariable("userId") String userId,
			@PathVariable("discussId") String discussId) throws Exception {
		System.out.println("NEW DISCUSS USER LIKES");
		int newCount = 0;
		Discuss discuss = null;
		try {

			discuss = (Discuss) discussRepository.findOne(discussId);

			if (discuss != null) {

				DiscussUserLikes discussUserLikes = discussUserLikesRepository
						.getByUserIdAndDiscussId(userId, discussId);
				DiscussUserLikes newDiscussUserLike = null;

				// User has already liked this - so ignore
				if (discussUserLikes != null
						&& discussUserLikes.getIsLike().equals("1")) {

					System.out.println("user " + userId
							+ " has already liked Discuss = " + discussId);

				} else {
					System.out
							.println("About to create new discuss user like...");
					// create a new user discuss like
					newDiscussUserLike = new DiscussUserLikes(userId,
							discussId, "1");
					discussUserLikesRepository.save(newDiscussUserLike);

					// Now increment the discuss collection aggrLikeCount

					int aggrLikeCount = discuss.getAggrLikeCount();
					newCount = aggrLikeCount + 1;
					//System.out.println("## new count ## " + newCount);
					discuss.setAggrLikeCount(newCount);
					discussRepository.save(discuss);

				}
			}
			System.out.println("Discuss after call to User Like = " + discuss.getAggrLikeCount());
			return discuss;
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
}