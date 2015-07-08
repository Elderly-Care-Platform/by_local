package com.beautifulyears.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.beautifulyears.repository.DiscussReplyRepository;
import com.beautifulyears.repository.DiscussRepository;

@Controller
@RequestMapping("/reply")
public class DiscussReplyController {

	@Autowired
	public DiscussReplyController(
			DiscussReplyRepository discussReplyRepository,
			DiscussRepository discussRepository, MongoTemplate mongoTemplate) {
	}

}
