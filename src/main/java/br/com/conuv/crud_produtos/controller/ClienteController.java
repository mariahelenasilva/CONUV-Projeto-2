package br.com.conuv.crud_produtos.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import br.com.conuv.crud_produtos.entity.Cliente;
import br.com.conuv.crud_produtos.service.ServicoClientes;

@RestController
@RequestMapping("/clientes")
public class ClienteController {
    private final ServicoClientes servico;

    public ClienteController(ServicoClientes servico) {
        this.servico = servico;
    }

    @PostMapping
    List<Cliente> create(@RequestBody Cliente cliente) {
        return servico.create(cliente);
    }

    @GetMapping
    List<Cliente> list() {
        return servico.list();
    }

    @PutMapping
    List<Cliente> update(@RequestBody Cliente cliente) {
        return servico.update(cliente);
    }

    @DeleteMapping("/{id}")
    List<Cliente> delete(@PathVariable("id") Integer id) {
        return servico.delete(id);
    }
}
