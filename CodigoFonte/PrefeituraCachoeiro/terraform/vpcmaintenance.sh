#!/bin/bash

# Função para verificar se uma VPC está em uso por uma instância EC2
check_ec2_instances() {
    local vpc_id=$1
    instances=$(aws ec2 describe-instances --filters "Name=vpc-id,Values=${vpc_id}" --query "Reservations[*].Instances[*].InstanceId" --output text)
    if [ -n "$instances" ]; then
        echo "VPC ${vpc_id} está em uso por instâncias EC2: ${instances}"
        return 0
    else
        return 1
    fi
}

# Função para verificar se uma VPC está em uso por um cluster ECS
check_ecs_clusters() {
    local vpc_id=$1
    clusters=$(aws ecs list-clusters --query "clusterArns" --output text)
    for cluster in $clusters; do
        vpc_for_cluster=$(aws ecs describe-clusters --clusters $cluster --query "clusters[*].vpcId" --output text)
        if [ "$vpc_for_cluster" == "$vpc_id" ]; then
            echo "VPC ${vpc_id} está em uso por um cluster ECS: ${cluster}"
            return 0
        fi
    done
    return 1
}

# Função para verificar se uma VPC está em uso por um cluster EKS
check_eks_clusters() {
    local vpc_id=$1
    clusters=$(aws eks list-clusters --query "clusters" --output text)
    for cluster in $clusters; do
        vpc_for_cluster=$(aws eks describe-cluster --name $cluster --query "cluster.resourcesVpcConfig.vpcId" --output text)
        if [ "$vpc_for_cluster" == "$vpc_id" ]; then
            echo "VPC ${vpc_id} está em uso por um cluster EKS: ${cluster}"
            return 0
        fi
    done
    return 1
}

# Função para verificar se uma VPC está em uso por um bucket S3
check_s3_buckets() {
    local vpc_id=$1
    buckets=$(aws s3api list-buckets --query "Buckets[*].Name" --output text)
    for bucket in $buckets; do
        vpc_for_bucket=$(aws s3api get-bucket-policy --bucket $bucket --query "Policy" --output text | grep "$vpc_id")
        if [ -n "$vpc_for_bucket" ]; then
            echo "VPC ${vpc_id} está em uso por um bucket S3: ${bucket}"
            return 0
        fi
    done
    return 1
}

# Função para verificar e remover subnets
remove_subnets() {
    local vpc_id=$1
    subnets=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=${vpc_id}" --query "Subnets[*].SubnetId" --output text)
    for subnet in $subnets; do
        echo "Removendo subnet ${subnet}..."
        aws ec2 delete-subnet --subnet-id $subnet
    done
}

# Função para verificar e remover interfaces de rede
remove_network_interfaces() {
    local vpc_id=$1
    interfaces=$(aws ec2 describe-network-interfaces --filters "Name=vpc-id,Values=${vpc_id}" --query "NetworkInterfaces[*].NetworkInterfaceId" --output text)
    for interface in $interfaces; do
        echo "Desanexando e removendo interface de rede ${interface}..."
        attachment_id=$(aws ec2 describe-network-interfaces --network-interface-ids $interface --query "NetworkInterfaces[*].Attachment.AttachmentId" --output text)
        if [ -n "$attachment_id" ]; then
            aws ec2 detach-network-interface --attachment-id $attachment_id
        fi
        aws ec2 delete-network-interface --network-interface-id $interface
    done
}

# Função para verificar e remover gateways de internet
remove_internet_gateways() {
    local vpc_id=$1
    gateways=$(aws ec2 describe-internet-gateways --filters "Name=attachment.vpc-id,Values=${vpc_id}" --query "InternetGateways[*].InternetGatewayId" --output text)
    for gateway in $gateways; do
        echo "Desanexando e removendo gateway de internet ${gateway}..."
        aws ec2 detach-internet-gateway --internet-gateway-id $gateway --vpc-id $vpc_id
        aws ec2 delete-internet-gateway --internet-gateway-id $gateway
    done
}

# Função para verificar e remover tabelas de rotas personalizadas
remove_route_tables() {
    local vpc_id=$1
    route_tables=$(aws ec2 describe-route-tables --filters "Name=vpc-id,Values=${vpc_id}" --query "RouteTables[*].RouteTableId" --output text)
    for route_table in $route_tables; do
        echo "Removendo tabela de rotas ${route_table}..."
        aws ec2 delete-route-table --route-table-id $route_table
    done
}

# Função para verificar e remover grupos de segurança
remove_security_groups() {
    local vpc_id=$1
    security_groups=$(aws ec2 describe-security-groups --filters "Name=vpc-id,Values=${vpc_id}" --query "SecurityGroups[*].GroupId" --output text)
    for security_group in $security_groups; do
        if [ "$security_group" != "default" ]; then
            echo "Removendo grupo de segurança ${security_group}..."
            aws ec2 delete-security-group --group-id $security_group
        fi
    done
}

# Função para remover a VPC se não estiver em uso
remove_vpc() {
    local vpc_id=$1
    if ! check_ec2_instances $vpc_id && ! check_ecs_clusters $vpc_id && ! check_eks_clusters $vpc_id && ! check_s3_buckets $vpc_id; then
        echo "Removendo recursos associados à VPC ${vpc_id}..."
        remove_network_interfaces $vpc_id
        remove_internet_gateways $vpc_id
        remove_route_tables $vpc_id
        remove_subnets $vpc_id
        remove_security_groups $vpc_id
        
        echo "Removendo VPC ${vpc_id}..."
        aws ec2 delete-vpc --vpc-id $vpc_id
        echo "VPC ${vpc_id} removida."
    else
        echo "VPC ${vpc_id} está em uso e não pode ser removida."
    fi
}

# Lista todas as VPCs
vpcs=$(aws ec2 describe-vpcs --query "Vpcs[*].VpcId" --output text)

# Itera sobre cada VPC e verifica se pode ser removida
for vpc_id in $vpcs; do
    remove_vpc $vpc_id
done