using FluentValidation;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes.Validacoes
{

    [ExcludeFromCodeCoverage]
    public class AtualizarProjetoValidacao : AbstractValidator<AtualizarProjetoRequest>
    {
        public AtualizarProjetoValidacao()
        {
            RuleFor(x => x.Nome)
                .NotEmpty()
                .WithMessage("O nome do projeto não pode ser vazio");

            RuleFor(x => x.Nome)
                .MaximumLength(500)
                .WithMessage("O nome do projeto não pode ser maior do que 500 caracteres");
        }
    }
}
