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
        return "graph";
    }
    @PostMapping("/addGraph")
    public String addGraph(@RequestParam("graph") String graph){
        Graph newGraph = new Graph(graph);
        graphRepository.save(newGraph);
        return "redirect:/";
    }
    @PostMapping("/graphs/{id}")
    public String deleteGraph(@PathVariable Long id) {
        graphRepository.deleteById(id);

        return "redirect:/";
    }

}
