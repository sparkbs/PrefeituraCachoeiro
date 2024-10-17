using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using System.Text;
using System.Text.Json;

namespace ConsoleTeste
{
    public static class TesteMedicoesProjeto
    {
        private static readonly HttpClient httpClient = new HttpClient();

        public static async Task CriarMedicao()
        {
            // URL da API
            var url = "https://localhost:7056/v1/medicoes/inserir";

            // Cria a instância da classe de requisição
            var criarMedicaoRequest = new CriarMedicoesProjetoRequest
            {
                NumeroMedicao = 1,
                IdContrato = 3,
                DataMedicao = DateTime.UtcNow,
                Resumo = "Medição inicial",
                Items = new List<ItemMedicoesProjetoRequest>
                {
                    new ItemMedicoesProjetoRequest
                    {
                        IdItemContrato = 1,
                        Unidade = 10
                    },
                    new ItemMedicoesProjetoRequest
                    {
                        IdItemContrato = 2,
                        Unidade = 20
                    }
                }
            };

            // Serializa o objeto para JSON
            var json = JsonSerializer.Serialize(criarMedicaoRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Configura o token de autorização, se necessário
            // httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "seu_token_aqui");

            try
            {
                // Envia a requisição POST
                var response = await httpClient.PostAsync(url, content);

                // Verifica se a requisição foi bem-sucedida
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Sucesso! Resposta: {responseContent}");
                }
                else
                {
                    Console.WriteLine($"Erro ao criar medição: {response.StatusCode}");
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Detalhes do erro: {errorContent}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exceção: {ex.Message}");
            }
        }

        public static async Task AlterarMedicao()
        {
            // URL da API
            var url = "https://localhost:7056/v1/medicoes/alterar";

            // Cria a instância da classe de requisição
            var criarMedicaoRequest = new AtualizarMedicoesProjetoRequest
            {
                IdMedicoesProjeto = 6,
                NumeroMedicao = 1,
                IdContrato = 3,
                DataMedicao = DateTime.UtcNow,
                Resumo = "Medição inicial Corrigida",
                Items = new List<ItemMedicoesProjetoRequest>
                {
                    new ItemMedicoesProjetoRequest
                    {
                        IdItemContrato = 1,
                        Unidade = 15
                    },
                    new ItemMedicoesProjetoRequest
                    {
                        IdItemContrato = 2,
                        Unidade = 25
                    }
                }
            };

            // Serializa o objeto para JSON
            var json = JsonSerializer.Serialize(criarMedicaoRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Configura o token de autorização, se necessário
            // httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "seu_token_aqui");

            try
            {
                // Envia a requisição PUT
                var response = await httpClient.PutAsync(url, content);

                // Verifica se a requisição foi bem-sucedida
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Sucesso! Resposta: {responseContent}");
                }
                else
                {
                    Console.WriteLine($"Erro ao atualizar medição: {response.StatusCode}");
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Detalhes do erro: {errorContent}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exceção: {ex.Message}");
            }
        }
    }
}