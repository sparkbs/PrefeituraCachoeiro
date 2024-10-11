using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class UsuariosGruposEntidadeMapper : IEntityTypeConfiguration<UsuariosGruposEntidade>
    {
        public void Configure(EntityTypeBuilder<UsuariosGruposEntidade> builder)
        {
            builder.ToTable("tb_usuarios_grupos").HasKey(i => i.IdUsuarioGrupo);
            builder.Property(x => x.IdUsuarioGrupo).HasColumnName("idusuariogrupo").IsRequired();
            builder.Property(x => x.IdUsuario).HasColumnName("idusuario").IsRequired();
            builder.Property(x => x.IdGrupo).HasColumnName("idgrupo").IsRequired();
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");
        }
    }
}