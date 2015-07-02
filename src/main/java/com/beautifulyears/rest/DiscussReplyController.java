package com.beautifulyears.rest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.beautifulyears.repository.DiscussReplyRepository;
import com.beautifulyears.repository.DiscussRepository;

@Controller
@RequestMapping("/reply")
public class DiscussReplyController {
	private Logger logger = Logger
			.getLogger(DiscussReplyController.class);

	private DiscussReplyRepository discussReplyRepository;
	private DiscussRepository discussRepository;
	private MongoTemplate mongoTemplate;

	@Autowired
	public DiscussReplyController(
			DiscussReplyRepository discussReplyRepository,
			DiscussRepository discussRepository, MongoTemplate mongoTemplate) {
		this.discussReplyRepository = discussReplyRepository;
		this.discussRepository = discussRepository;
		this.mongoTemplate = mongoTemplate;
	}

}
