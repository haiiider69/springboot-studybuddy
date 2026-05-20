package com.campus.studybuddy.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${openrouter.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://openrouter.ai")
            .build();

    public String explainTopic(String topic, String context) {
        String prompt = context != null && !context.isBlank()
                ? "Explain this topic simply for a university student: " + topic + "\nExtra context: " + context
                : "Explain this topic simply for a university student: " + topic;
        return callOpenRouter(prompt);
    }

    public String generateQuiz(String topic) {
        String prompt = "Generate 5 multiple choice questions about the following content:\n" + topic +
                "\nFormat each question as:\nQ: question\nA) option\nB) option\nC) option\nD) option\nAnswer: correct option\n";
        return callOpenRouter(prompt);
    }

    public String summarizeNotes(String notes) {
        String prompt = "Summarize these lecture notes clearly and concisely for a university student:\n" + notes;
        return callOpenRouter(prompt);
    }

    private String callOpenRouter(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "model", "openrouter/free",
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                )
        );

        try {
            Map response = webClient.post()
                    .uri("/api/v1/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .header("HTTP-Referer", "http://localhost:9097")
                    .header("X-Title", "StudyBuddy")
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(status -> status.isError(), clientResponse ->
                            clientResponse.bodyToMono(String.class).map(body -> {
                                System.out.println("OPENROUTER ERROR: " + body);
                                return new RuntimeException("API Error: " + body);
                            })
                    )
                    .bodyToMono(Map.class)
                    .block();

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            return (String) message.get("content");

        } catch (Exception e) {
            System.out.println("FULL ERROR: " + e.getMessage());
            throw e;
        }
    }
}