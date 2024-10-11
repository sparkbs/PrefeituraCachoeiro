using FluentValidation;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes.Validacoes
{
    [ExcludeFromCodeCoverage]
    public class CriarUsuarioValidacao : AbstractValidator<CriarUsuarioRequest>
    {
        public CriarUsuarioValidacao()
        {
            RuleFor(x => x.Login)
                .NotEmpty()
                .WithMessage("O login do usuário não pode ser vazio");

            RuleFor(x => x.Login)
                .MaximumLength(50)
                .WithMessage("O login do usuário não pode ser maior do que 50 caracteres");
            
            RuleFor(x => x.Nome)
                .NotEmpty()
                .WithMessage("O nome do usuário não pode ser vazio");

            RuleFor(x => x.Nome)
                .MaximumLength(1000)
                .WithMessage("O nome do usuário não pode ser maior do que 1000 caracteres");

            RuleFor(x => x.Senha)
                .NotEmpty()
                .WithMessage("A senha do usuário não pode ser vazio");

            RuleFor(x => x.Senha)
                .MaximumLength(50)
                .WithMessage("A senha do usuário não pode ser maior do que 50 caracteres");
        }
    }
}