package com.ssafy.fitcha.config;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ssafy.fitcha.model.dto.User;
import com.ssafy.fitcha.security.oauth.CustomOAuth2UserService;
import com.ssafy.fitcha.security.oauth.CustomOidcUserService;
import com.ssafy.fitcha.util.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

	@Autowired
	private CustomOAuth2UserService customOAuth2UserService;

	@Autowired
	private CustomOidcUserService customOidcUserService;

	@Autowired
	private JwtUtil jwtUtil;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.cors().and().csrf().disable().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				.and().authorizeHttpRequests(auth -> auth
						// 1) 여기에 static resources 허용 (css, js, images, index.html 등)
						.requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()

						.requestMatchers("/", "/index.html").permitAll()

						// 2) 로그인 / 회원가입 / 닉네임 API
						.requestMatchers("/user/login", "/user/signup", "/api/nickname/**").permitAll()

						// 3) 채팅 REST API 허용
						.requestMatchers("/api/chat/**").permitAll()

						// 4) WebSocket STOMP 엔드포인트
						.requestMatchers("/ws/**", "/ws/info", "/ws/info/**", "/topic/**", "/app/**").permitAll()

						// 5) 파일시스템 이미지
						.requestMatchers("/upload/**").permitAll()
						
						// 날씨 호출 & Home view
						.requestMatchers("/weather","/proof/images","/home","/challenge/top5").permitAll()
						
						// 6) 그 외는 모두 인증 필요
						.anyRequest().authenticated())
				.oauth2Login(
						oauth2 -> oauth2.authorizationEndpoint(endpoint -> endpoint.baseUri("/oauth2/authorization"))
								.redirectionEndpoint(endpoints -> endpoints.baseUri("/login/oauth2/code/*"))
								.userInfoEndpoint(userInfo -> userInfo.oidcUserService(customOidcUserService)
										.userService(customOAuth2UserService))
								.successHandler((request, response, authentication) -> {
									// 세션에서 꺼낸 값이 null 이면 빈 문자열로 대체
									String status = (String) request.getSession().getAttribute("signupStatus");
									if (status == null)
										status = "";

									User user = (User) request.getSession().getAttribute("user");
									String userId = (user != null && user.getUserId() != null) ? user.getUserId() : "";
									String nickName = (user != null && user.getNickName() != null) ? user.getNickName()
											: "";

									// 토큰은 당연히 null 이 아니라고 가정
									String token = jwtUtil.createToken(authentication.getName());

									String redirectUrl = "http://localhost:5173/oauth-success" + "?token="
											+ URLEncoder.encode(token, StandardCharsets.UTF_8) + "&userId="
											+ URLEncoder.encode(userId, StandardCharsets.UTF_8) + "&nickName="
											+ URLEncoder.encode(nickName, StandardCharsets.UTF_8) + "&signup="
											+ URLEncoder.encode(status, StandardCharsets.UTF_8);

									response.sendRedirect(redirectUrl);
								}))
				.exceptionHandling().authenticationEntryPoint((request, response, authException) -> {
					response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
				});

		http.addFilterBefore(new JwtAuthenticationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
