package br.com.conuv.crud_produtos.service;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import br.com.conuv.crud_produtos.entity.Venda;
import br.com.conuv.crud_produtos.repository.RepositorioVendas;

@Service
public class ServicoVendas {
    private final RepositorioVendas repositorio;

    public ServicoVendas(RepositorioVendas repositorio) {
        this.repositorio = repositorio;
    }

    public List<Venda> create(Venda venda) {
        venda.setId(null);
        repositorio.save(venda);
        return list();
    }

    public List<Venda> list() {
        return repositorio.findAll(Sort.by("data").ascending());
    }

    public List<Venda> update(Venda venda) {
        if (venda.getId() == null || !repositorio.existsById(venda.getId())) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, "Registro não encontrado.");
        }
        repositorio.save(venda);
        return list();
    }

    public List<Venda> delete(Integer id) {
        repositorio.deleteById(id);
        return list();
    }
}
