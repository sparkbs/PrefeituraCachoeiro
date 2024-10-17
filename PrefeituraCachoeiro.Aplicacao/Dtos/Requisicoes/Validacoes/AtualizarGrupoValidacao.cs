using FluentValidation;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes.Validacoes
{
    [ExcludeFromCodeCoverage]
    public class AtualizarGrupoValidacao : AbstractValidator<AtualizarGrupoRequest>
    {
        public AtualizarGrupoValidacao()
        {
            RuleFor(x => x.Nome)
                .NotEmpty()
                .WithMessage("O nome do grupo não pode ser vazio");

            RuleFor(x => x.Nome)
                .MaximumLength(50)
                .WithMessage("O nome do grupo não pode ser maior do que 50 caracteres");
        }
    }
}