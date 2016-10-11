function nerv(wi,ran){
    var n=0;
    var w=[];
    for(var i=0;i<wi;i++)   w[i]=Math.random()*ran*2-ran;
    return {n:n,
            w:w}
}
function activation(x){
    return 1/(1+Math.exp(-x));
}
function neu_net(inp,out,hid) {
    var layer=[];
    for(var i=0;i<hid+2;i++){
        layer[i]=[];
        for(var j=0;j<Math.round(inp+i*(out-inp)/(hid+1));j++){
            layer[i][j]=new nerv((i==hid+1)?(0):(inp+Math.round((i+1)*(out-inp)/(hid+1))),2);
        }
    }
    return {layer:layer}
}
function compute(net, inp) {
    for(var i=0;i<net.layer.length;i++){
        for(var j=0;j<net.layer[i].length;j++){
            net.layer[i][j].n=0;
        }
    }
    for(var i=0;i<net.layer[0].length;i++)  net.layer[0][i].n = inp[i];
    for(var i=0;i<net.layer.length-1;i++){
        for(var j=0;j<net.layer[i].length;j++){
            if(i!=0)net.layer[i][j].n=activation(net.layer[i][j].n);
            for(var k=0;k<net.layer[i][j].w.length;k++){
                net.layer[i+1][k].n+=net.layer[i][j].n*net.layer[i][j].w[k];
            }
        }
    }
    for(var i=0;i<net.layer[net.layer.length-1].length;i++)  net.layer[net.layer.length-1][i].n=activation(net.layer[net.layer.length-1][i].n);
    var outp=[];
    for(var i=0;i<net.layer[net.layer.length-1].length;i++)  outp[i]=net.layer[net.layer.length-1][i].n;
    return outp;
}

function mutate(a, b, mtRate){
    var ans = neu_net(a.layer[0].length,a.layer[a.layer.length - 1].length,a.layer.length - 2);
    var fromA=0,fromB=0,fromMut=0;
    for(var i=0;i<a.layer.length;i++){
        for(var j=0;j<a.layer[i].length;j++){
            for(var k=0;k<a.layer[i][j].w.length;k++){
                if(Math.random() < mtRate) {
                    ans.layer[i][j].w[k]=Math.random()*1-0.5;
                    fromMut++;
                }else
                    if(Math.random()<0.5){
                        ans.layer[i][j].w[k]=a.layer[i][j].w[k];
                        fromA++;
                    }else{
                        ans.layer[i][j].w[k]=b.layer[i][j].w[k];
                        fromB++;
                    }
            }
        }
    }
    var all=fromA+fromB+fromMut;
    return [ans,{fromA:fromA/all,fromB:fromB/all,fromMut:fromMut/all}];
}
