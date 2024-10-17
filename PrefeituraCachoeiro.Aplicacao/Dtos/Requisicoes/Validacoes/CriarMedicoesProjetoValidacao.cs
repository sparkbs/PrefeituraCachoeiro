using FluentValidation;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes.Validacoes
{
    [ExcludeFromCodeCoverage]
    public class CriarMedicoesProjetoValidacao : AbstractValidator<CriarMedicoesProjetoRequest>
    {
        public CriarMedicoesProjetoValidacao()
        {
            RuleFor(x => x.Resumo)
                .MaximumLength(5000)
                .WithMessage("O resumo não pode ser maior do que 5000 caracteres");
        }
    }
}