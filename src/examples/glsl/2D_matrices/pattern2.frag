#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    return fract(_st);
}

vec2 rotate2D (vec2 _st, float _angle) {
    _st -= 0.5;
    _st = mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

float box(vec2 _st, vec2 _size, float _smoothEdges){
    _size = vec2(0.5)-_size*0.5;
    vec2 aa = vec2(_smoothEdges*0.5);
    vec2 uv = smoothstep(_size,_size+aa,_st);
    uv *= smoothstep(_size,_size+aa,vec2(1.0)-_st);
    return uv.x*uv.y;
}

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;

  vec3 color = vec3(0.0);

  // st *= 4.0;
  // st = fract(st);
  // Divide the space in 4
  st = tile(st, 4.0);
  // Use a matrix to rotate the space 45 degrees
  st = rotate2D(st, sin(u_time)*PI);

  color = vec3(box(st,vec2(0.7),0.01));
  // color = vec3(st, 0.0);

  gl_FragColor = vec4(color, 1.0); 
}
