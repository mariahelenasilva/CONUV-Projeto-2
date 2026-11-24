package br.com.conuv.crud_produtos.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import br.com.conuv.crud_produtos.entity.Venda;
import br.com.conuv.crud_produtos.service.ServicoVendas;

@RestController
@RequestMapping("/vendas")
public class VendaController {
    private final ServicoVendas servico;

    public VendaController(ServicoVendas servico) {
        this.servico = servico;
    }

    @PostMapping
    List<Venda> create(@RequestBody Venda venda) {
        return servico.create(venda);
    }

    @GetMapping
    List<Venda> list() {
        return servico.list();
    }

    @PutMapping
    List<Venda> update(@RequestBody Venda venda) {
        return servico.update(venda);
    }

    @DeleteMapping("/{id}")
    List<Venda> delete(@PathVariable("id") Integer id) {
        return servico.delete(id);
    }
}
