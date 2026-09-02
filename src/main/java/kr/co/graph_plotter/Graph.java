package kr.co.graph_plotter;
import jakarta.persistence.*;

@Entity(name = "Graph")
@Table(name = "graphs")

public class Graph {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String graph;

    protected Graph() {}

    public Graph(String graph) {
        this.graph =  graph;
    }

    public Long getId() {
        return id;
    }

    public String getGraph() {
        return graph;
    }
}
