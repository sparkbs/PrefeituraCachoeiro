using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class EmpresaEntidadeMapper : IEntityTypeConfiguration<EmpresaEntidade>
    {
        public void Configure(EntityTypeBuilder<EmpresaEntidade> builder)
        {
            builder.ToTable("tb_empresa").HasKey(i => i.EmpresaId);
            builder.Property(x => x.EmpresaId).HasColumnName("empresaid").IsRequired();
            builder.Property(x => x.Nome).HasColumnName("nome").HasColumnType("varchar(200)").IsRequired();
            builder.Property(x => x.Logo).HasColumnName("logo").HasColumnType("varchar(5000)").IsRequired();
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");

            builder.HasMany(x => x.Contratos)
                   .WithOne(x => x.Empresa)
                   .HasForeignKey(x => x.EmpresaId)
                   .HasConstraintName("fk_empresas_contratos");
        }
    }
}