## Passos da Pipeline do Gitlab
### Este pipeline faz o seguinte:

1. Stage de Build:

    * Constrói a imagem Docker
    * Faz push da imagem para o ECR
## Rodando o build
```shell
  ansible-playbook ci.yml --ask-become-pass
```
2. Stage de Deploy:
    * Obtém a task definition atual
    * Atualiza a imagem na task definition com a nova imagem do ECR
    * Registra a nova task definition
    * Atualiza o serviço ECS com a nova task definition
    * Espera pela estabilização do serviço
    * Obtém o novo IP da task
    * Atualiza o registro A no Route53 com o novo IP

## Rodando o deploy
```shell
  ansible-playbook cd.yml --ask-become-pass
```


### Useful Links
* Swagger UI: http://localhost:8080/swagger-ui.html