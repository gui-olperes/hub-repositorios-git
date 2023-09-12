import os
import eel
import github
import requests
from github import Github

# Configurações
eel.init('frontend')

# Credenciais do GitHub (substitua com as suas credenciais)
github_username = 'gui-olperes'
github_token = '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'

# Inicializando o cliente do GitHub
g = Github(github_username, github_token)

@eel.expose
def criar_repositorio(nome):
    user = g.get_user()
    user.create_repo(nome)
    return "Repositório criado com sucesso!"

@eel.expose
def listar_repositorios():
    user = g.get_user()
    repos = [repo.name for repo in user.get_repos()]
    return repos

@eel.expose
def fazer_upload_arquivo(nome_repositorio, nome_arquivo, mensagem_commit, conteudo_arquivo):
    user = g.get_user()
    repo = user.get_repo(nome_repositorio)

    try:
        arquivo_existente = repo.get_contents(nome_arquivo)
        sha_arquivo_existente = arquivo_existente.sha

        bytes_conteudo = bytes(conteudo_arquivo)

        repo.update_file(
            path=nome_arquivo,
            message=mensagem_commit,
            content=bytes_conteudo,
            sha=sha_arquivo_existente
        )

        return "Arquivo atualizado com sucesso!"
    except Exception as e:
        print(e)
        return "Erro ao atualizar o arquivo."


@eel.expose
def excluir_repositorio(nome_repositorio):
    user = g.get_user()
    repo = user.get_repo(nome_repositorio)
    repo.delete()
    return "Repositório excluído com sucesso!"

@eel.expose
def listar_arquivos(nome_repositorio):
    user = g.get_user()
    repo = user.get_repo(nome_repositorio)
    try:
        contents = repo.get_contents("/")
        arquivos = [content.name for content in contents]
        return arquivos
    except Exception as e:
        return "Erro ao excluir o arquivo: " + str(e)

@eel.expose
def excluir_arquivo(nome_repositorio, nome_arquivo):
    user = g.get_user()
    repo = user.get_repo(nome_repositorio)

    try:
        arquivo = repo.get_contents(nome_arquivo)
        repo.delete_file(arquivo.path, "Removendo arquivo", arquivo.sha)
        return "Arquivo excluído com sucesso!"
    except Exception as e:
        return "Erro ao excluir o arquivo: " + str(e)


eel.start('index.html', size=(600, 600))