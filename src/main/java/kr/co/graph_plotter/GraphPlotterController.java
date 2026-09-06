package kr.co.graph_plotter;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class GraphPlotterController {
    private final GraphRepository graphRepository;

    public GraphPlotterController(GraphRepository graphRepository) {
        this.graphRepository = graphRepository;
    }
    @GetMapping("/")
    public String graph(Model model) {
        model.addAttribute("graphs", graphRepository.findAll());
        //db에서 모든 graph데이터를 가져와서 thymeleaf같은 뷰에서 사용할 수 있도록 전달
        return "graph";
    }

}
