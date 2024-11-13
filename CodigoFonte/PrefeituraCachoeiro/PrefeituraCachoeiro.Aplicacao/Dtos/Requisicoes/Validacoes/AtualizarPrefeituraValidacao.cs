using FluentValidation;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes.Validacoes
{
    [ExcludeFromCodeCoverage]
    public class AtualizarPrefeituraValidacao : AbstractValidator<AtualizarPrefeituraRequest>
    {
        public AtualizarPrefeituraValidacao()
        {
            RuleFor(x => x.Nome)
                .NotEmpty()
                .WithMessage("O nome da prefeitura não pode ser vazio");

            RuleFor(x => x.Nome)
                .MaximumLength(200)
                .WithMessage("O nome da prefeitura não pode ser maior do que 200 caracteres");
        }
    }
}