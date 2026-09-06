package kr.co.graph_plotter;

import org.springframework.web.bind.annotation.*;


@RestController //반환값을 데이터(JSON)으로 해석
public class GraphAPIController {

    private final GraphRepository graphRepository;

    public GraphAPIController(GraphRepository graphRepository) {
        this.graphRepository = graphRepository;
    }
    @PostMapping("/api/graphs")
    public Graph add(@RequestBody GraphRequest request) { //ResponseEntity: 사용자의 응답데이터 클래스
        Graph newGraph = new Graph(request.expression());
        return graphRepository.save(newGraph); //JSON
    }

    @DeleteMapping("/api/graphs/{id}")
    public void delete(@PathVariable long id) {
        graphRepository.deleteById(id);
    }

    public record GraphRequest(String expression) {
    } //record형 -> 기존의 자료형에서 작성해야하는 함수들을 안써도 되도록 해줌

}
