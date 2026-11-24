package br.com.conuv.crud_produtos.service;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import br.com.conuv.crud_produtos.entity.Cliente;
import br.com.conuv.crud_produtos.repository.RepositorioClientes;

@Service
public class ServicoClientes {
    private final RepositorioClientes repositorio;

    public ServicoClientes(RepositorioClientes repositorio) {
        this.repositorio = repositorio;
    }

    public List<Cliente> create(Cliente cliente) {
        cliente.setId(null);
        repositorio.save(cliente);
        return list();
    }

    public List<Cliente> list() {
        return repositorio.findAll(Sort.by("nome").ascending());
    }

    public List<Cliente> update(Cliente cliente) {
        if (cliente.getId() == null || !repositorio.existsById(cliente.getId())) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, "Registro não encontrado.");
        }
        repositorio.save(cliente);
        return list();
    }

    public List<Cliente> delete(Integer id) {
        repositorio.deleteById(id);
        return list();
    }
}
