using FluentValidation;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes.Validacoes
{
    [ExcludeFromCodeCoverage]
    public class CriarPrefeituraValidacao : AbstractValidator<CriarPrefeituraRequest>
    {
        public CriarPrefeituraValidacao()
        {
            RuleFor(x => x.Nome)
                .NotEmpty()
                .WithMessage("O nome da prefeitura não pode ser vazio");

            RuleFor(x => x.Nome)
                .MaximumLength(200)
                .WithMessage("O nome da prefeitura não pode ser maior do que 200 caracteres");

            RuleFor(x => x.Logo)
                .NotEmpty()
                .WithMessage("O logo da prefeitura não pode ser vazio");
        }
    }
}