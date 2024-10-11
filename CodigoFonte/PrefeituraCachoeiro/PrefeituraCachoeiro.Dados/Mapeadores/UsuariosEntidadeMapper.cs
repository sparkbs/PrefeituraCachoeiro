using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class UsuariosEntidadeMapper : IEntityTypeConfiguration<UsuariosEntidade>
    {
        public void Configure(EntityTypeBuilder<UsuariosEntidade> builder)
        {
            builder.ToTable("tb_usuarios").HasKey(i => i.IdUsuario);
            builder.Property(x => x.IdUsuario).HasColumnName("idusuario").IsRequired();
            builder.Property(x => x.Login).HasColumnName("login").IsRequired().HasColumnType("varchar(50)");
            builder.Property(x => x.Nome).HasColumnName("nome").IsRequired().HasColumnType("varchar(1000)");
            builder.Property(x => x.Senha).HasColumnName("senha").IsRequired().HasColumnType("varchar(5000)");
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");
            builder.HasMany(x => x.Grupos)
                .WithOne(x => x.Usuario)
                .HasForeignKey(x => x.IdUsuario)
                .HasConstraintName("usuarios_grupos");
        }
    }
}