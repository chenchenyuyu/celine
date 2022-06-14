#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random(vec2 _st) {
  return fract(sin(dot(_st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  
  vec3 color = vec3(st, 0.0);

  float rnd = random( st );

  gl_FragColor = vec4(vec3(rnd), 1.0);
}