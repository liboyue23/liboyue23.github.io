Raphael.prototype.vexLine=function(e,t,n,i){return this.path("M"+e+" "+t+"L"+n+" "+i)},ChordBox=function(e,t,n,i,r){this.paper=e,this.x=t,this.y=n,this.width=i?i:100,this.height=r?r:100,this.num_strings=6,this.num_frets=5,this.spacing=this.width/this.num_strings,this.fret_spacing=this.height/(this.num_frets+2),this.x+=this.spacing/2,this.y+=this.fret_spacing,this.metrics={circle_radius:this.width/28,text_shift_x:this.width/29,text_shift_y:this.height/29,font_size:Math.ceil(this.width/9),bar_shift_x:this.width/28,bridge_stroke_width:Math.ceil(this.height/36),chord_fill:"#444"},this.position=0,this.position_text=0,this.chord=[],this.bars=[]},ChordBox.prototype.setNumFrets=function(e){return this.num_frets=e,this.fret_spacing=this.height/(this.num_frets+1),this},ChordBox.prototype.setChord=function(e,t,n,i,r){return this.chord=e,this.position=t||0,this.position_text=i||0,this.bars=n||[],this.tuning=r||["E","A","D","G","B","E"],r==[]&&(this.fret_spacing=this.height/(this.num_frets+1)),this},ChordBox.prototype.setPositionText=function(e){return this.position_text=e,this},ChordBox.prototype.draw=function(){var e=this.spacing,t=this.fret_spacing;this.position<=1?this.paper.vexLine(this.x,this.y-this.metrics.bridge_stroke_width/2,this.x+e*(this.num_strings-1),this.y-this.metrics.bridge_stroke_width/2).attr("stroke-width",this.metrics.bridge_stroke_width):this.paper.text(this.x-this.spacing/2-this.metrics.text_shift_x,this.y+this.fret_spacing/2+this.metrics.text_shift_y+this.fret_spacing*this.position_text,this.position).attr("font-size",this.metrics.font_size);for(var n=0;n<this.num_strings;++n)this.paper.vexLine(this.x+e*n,this.y,this.x+e*n,this.y+t*this.num_frets);for(var n=0;n<this.num_frets+1;++n)this.paper.vexLine(this.x,this.y+t*n,this.x+e*(this.num_strings-1),this.y+t*n);if(this.tuning!=[])for(var i=this.tuning,n=0;n<i.length;++n){var r=this.paper.text(this.x+this.spacing*n,this.y+(this.num_frets+1)*this.fret_spacing,i[n]);r.attr("font-size",this.metrics.font_size)}for(var n=0;n<this.chord.length;++n)this.lightUp(this.chord[n][0],this.chord[n][1]);for(var n=0;n<this.bars.length;++n)this.lightBar(this.bars[n].from_string,this.bars[n].to_string,this.bars[n].fret)},ChordBox.prototype.lightUp=function(e,t){e=this.num_strings-e;var n=0;1==this.position&&1==this.position_text&&(n=this.position_text);var i=!1;"x"==t?(t=0,i=!0):t-=n;var r=this.x+this.spacing*e,o=this.y+this.fret_spacing*t;if(0==t&&(o-=this.metrics.bridge_stroke_width),i)a=this.paper.text(r,o-(this.fret_spacing-this.metrics.font_size),"X").attr({"font-size":this.metrics.font_size});else{var a=this.paper.circle(r,o-Math.floor(this.fret_spacing/2),this.metrics.circle_radius);t>0&&a.attr("fill",this.metrics.chord_fill)}return this},ChordBox.prototype.lightBar=function(e,t,n){1==this.position&&1==this.position_text&&(n-=this.position_text),string_from_num=this.num_strings-e,string_to_num=this.num_strings-t;var i=this.x+this.spacing*string_from_num-this.metrics.bar_shift_x,r=this.x+this.spacing*string_to_num+this.metrics.bar_shift_x,o=this.y+this.fret_spacing*(n-1)+this.fret_spacing/4,a=this.y+this.fret_spacing*(n-1)+3*(this.fret_spacing/4);return this.paper.rect(i,o,r-i,a-o,this.metrics.circle_radius).attr("fill",this.metrics.chord_fill),this};