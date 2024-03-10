package com.web;

public class Greeting {
	private String id;
	private String content;
	
	public Greeting() {}
	
	public Greeting(String id, String content) {
		this.id = id;
		this.content = content;
	}

	public String getId() {
		return id;
	}

	public String getContent() {
		return content;
	}
}
