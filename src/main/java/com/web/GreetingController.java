package com.web;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class GreetingController {
	@MessageMapping("/chat")
	@SendTo("/topic/greetings")
	public Greeting chatting(Greeting message) throws Exception{
//		Thread.sleep(500);
		return new Greeting(message.getId(), HtmlUtils.htmlEscape(message.getContent()));
	}
}
