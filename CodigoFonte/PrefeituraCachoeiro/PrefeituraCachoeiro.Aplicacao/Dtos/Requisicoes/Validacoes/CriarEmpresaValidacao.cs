using FluentValidation;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes.Validacoes
{
    [ExcludeFromCodeCoverage]
    public class CriarEmpresaValidacao : AbstractValidator<CriarEmpresaRequest>
    {
        public CriarEmpresaValidacao()
        {
            RuleFor(x => x.Nome)
                .NotEmpty()
                .WithMessage("O nome da empresa não pode ser vazio");

            RuleFor(x => x.Nome)
                .MaximumLength(200)
                .WithMessage("O nome da empresa não pode ser maior do que 200 caracteres");

            RuleFor(x => x.Logo)
                .NotEmpty()
                .WithMessage("O logo da empresa não pode ser vazio");

        }
    }
}