import { Component, AfterViewInit, ElementRef, ViewChild, EventEmitter, Input, NgZone, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BackdropComponent } from 'src/app/shared/backdrop/backdrop.component';
import { ReactiveWebGLBackground } from './ReactiveWebGLBackground';
import { Subscription, fromEvent } from 'rxjs';
import { ControlValueAccessor } from '@angular/forms';

import { DEFAULT_SHADER_PROGRAMS, ShaderProgramData, UNIFORM_DEFS, UNIFORM_NAMES } from "./shader-programs";
import parsedOpenGlDocs from './parsedOpenGlDocs';
import { ActivatedRoute } from '@angular/router';
import { DropdownLinkData } from 'src/app/shared/dropdown-link-selector/dropdown-link-selector.component';

let loadedMonaco = false;
let loadPromise: Promise<void>;
declare var monaco: any;

@Component({
  selector: 'x-fragmentwriter',
  templateUrl: './fragmentwriter.component.html',
  styleUrls: ['./fragmentwriter.component.scss']
})
export class FragmentwriterComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  private _value: string = '';

  propagateChange = (_: any) => { };
  onTouched = () => { };

  @Input('insideNg')
  set insideNg(insideNg: boolean) {
    this._insideNg = insideNg;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this._options, this.insideNg);
    }
  }

  @ViewChild('editor') editorContainer: ElementRef;

  public bgAnimation = new ReactiveWebGLBackground();
  public shouldHide: boolean = false;
  public isWebGlEnabled: boolean = BackdropComponent.isWebGlEnabled;
  public defaultShaderLinks: DropdownLinkData[] = DEFAULT_SHADER_PROGRAMS.map(
    (p) => {
      return {
        text: p.name,
        url: `/projects/fragmentwriter?shader=${p.url}`
      }
    }
  );
  public compilationErrors: string = "";

  private _editor: any;
  private _options: any = {
    theme: 'vs-dark',
    language: 'glsl',
    autoIndent: true,
    formatOnPaste: true,
    formatOnType: true
  };
  private _windowResizeSubscription: Subscription;
  private _insideNg: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private zone: NgZone,
    private titleService: Title
  ) { }

  writeValue(value: any): void {
    this._value = value || '';
    // Fix for value change while dispose in process.
    setTimeout(() => {
      if (this._editor && !this._options.model) {
        this._editor.setValue(this._value);
      }
    });
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public tryShaderUpdate(): void {
    this.bgAnimation.fragmentShaderOverride = this._value;
    try {
      this.bgAnimation.attemptRecompileAndReinitialize();
    }
    catch (e) {
      const err = e as Error;
      if (err) {
        console.log(err.message);
        this.compilationErrors = err.message;
      }
      return;
    }
    this.compilationErrors = "";
  }

  onKeyPress(e: KeyboardEvent, c: FragmentwriterComponent) {
    if (e.ctrlKey && e.key == 's') {
      e.preventDefault();
      c.tryShaderUpdate();
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle('Fragment Writer');
    window.onkeydown = (e) => this.onKeyPress(e, this);
    this.route.queryParams.subscribe(params => {
      const shaderProgram = DEFAULT_SHADER_PROGRAMS.find(program => program.url === params['shader']);
      this.bgAnimation.fragmentShaderOverride = undefined;
      if (shaderProgram) {
        this.bgAnimation.shaderProgramData = shaderProgram;
      }
    });
  }

  ngAfterViewInit(): void {
    this.isWebGlEnabled = BackdropComponent.isWebGlEnabled;
    this._value = this.bgAnimation.getFragmentShader();

    if (loadedMonaco) {
      // Wait until monaco editor is available
      loadPromise.then(() => {
        this.initMonaco(this._options, this.insideNg);
      });
    } else {
      loadedMonaco = true;
      loadPromise = new Promise<void>((resolve: any) => {
        const baseUrl = "./assets";
        if (typeof ((<any>window).monaco) === 'object') {
          this.initMonaco(this._options, this.insideNg);
          resolve();
          return;
        }
        const onGotAmdLoader: any = () => {
          // Load monaco
          (<any>window).require.config({ paths: { vs: `${baseUrl}/monaco/min/vs` } });
          (<any>window).require([`vs/editor/editor.main`], () => {
            this.initMonaco(this._options, this.insideNg);
            resolve();
          });
        };

        // Load AMD loader if necessary
        if (!(<any>window).require) {
          const loaderScript: HTMLScriptElement = document.createElement('script');
          loaderScript.type = 'text/javascript';
          loaderScript.src = `${baseUrl}/monaco/min/vs/loader.js`;
          loaderScript.addEventListener('load', onGotAmdLoader);
          document.body.appendChild(loaderScript);
        } else {
          onGotAmdLoader();
        }
      });
    }
  }

  private initMonaco(options: any, insideNg: boolean): void {
    const hasModel = !!options.model;

    monaco.languages.register({ id: "glsl" });
    monaco.languages.setLanguageConfiguration("glsl", {
      wordPattern:
        /(-?(?:(?:\d+\.\d*|\.\d+)(?:[eE][+-]?\d+)?|\d+[eE][+-]?\d+)[fF]?)|([^\`\~\!\@\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
      comments: {
        lineComment: "//",
        blockComment: ["/*", "*/"],
      },
      brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
      ],
      folding: {
        markers: {
          start: /^ *# *pragma +region\b/,
          end: /^ *# *pragma +endregion\b/,
        },
      },
    });
    monaco.languages.setMonarchTokensProvider("glsl", {
      keywords: [
        "uniform",
        "const",
        "break",
        "continue",
        "do",
        "for",
        "while",
        "if",
        "else",
        "switch",
        "case",
        "default",
        "in",
        "out",
        "inout",
        "true",
        "false",
        "invariant",
        "discard",
        "return",
        "struct",
        "precision",
        "highp",
        "mediump",
        "lowp",
        "layout",
        "centroid",
        "flat",
        "smooth",
      ],
      builtinFunctions: Object.keys(parsedOpenGlDocs).filter(k => !k.startsWith("gl_")),
      builtinVars: Object.keys(parsedOpenGlDocs).filter(k => k.startsWith("gl_")),

      pseudoTypeKeywords: [
        "genType",
        "genIType",
        "genUType",
        "genBType",
        "vec",
        "ivec",
        "uvec",
        "bvec",
        "mat",
        "gvec",
        "gvec4",
        "gSampler2D",
        "gsampler2D",
        "gSampler3D",
        "gsampler3D",
        "sampler2DShadow",
        "gsampler2DArray",
        "sampler2DArrayShadow",
        "gsamplerCube",
        "samplerCubeShadow",
      ],
      typeKeywords: [
        "bool",
        "bvec2",
        "bvec3",
        "bvec4",

        "int",
        "ivec2",
        "ivec3",
        "ivec4",

        "mat2",
        "mat2x2",
        "mat2x3",
        "mat2x4",
        "mat3",
        "mat3x2",
        "mat3x3",
        "mat3x4",
        "mat4",
        "mat4x2",
        "mat4x3",
        "mat4x4",

        "sampler2D",
        "sampler3D",
        "samplerCube",
        "sampler2DShadow",
        "samplerCubeShadow",
        "sampler2DArray",
        "sampler2DArrayShadow",
        "isampler2D",
        "isampler3D",
        "isamplerCube",
        "isampler2DArray",
        "usampler2D",
        "usampler3D",
        "usamplerCube",
        "usampler2DArray",

        "uint",
        "uvec2",
        "uvec3",
        "uvec4",

        "float",
        "vec2",
        "vec3",
        "vec4",
        "void",
      ],
      uniforms: UNIFORM_NAMES,

      operators: [
        "=",
        ">",
        "<",
        "!",
        "~",
        "?",
        ":",
        "==",
        "<=",
        ">=",
        "!=",
        "&&",
        "||",
        "++",
        "--",
        "+",
        "-",
        "*",
        "/",
        "&",
        "|",
        "^",
        "%",
        "<<",
        ">>",
        ">>>",
        "+=",
        "-=",
        "*=",
        "/=",
        "&=",
        "|=",
        "^=",
        "%=",
        "<<=",
        ">>=",
        ">>>=",
      ],

      tokenizer: {
        root: [
          [/\bmain\b/, "meta.scss"],
          [
            /[a-zA-Z_]\w*/,
            {
              cases: {
                "@keywords": "keyword",
                "@typeKeywords": "type",
                "@builtinFunctions": "predefined.sql",
                "@builtinVars": "string.sql",
                "@uniforms": "keyword.json",
                "@default": "identifier",
              },
            },
          ],
          [/^ *# */, "directive", "@directive"],
          { include: "@whitespace" },
          { include: "@numbers" },
          [/(\.)([a-zA-Z_]\w*)/, ["operator", "attribute.value"]],
          [/[{}()\[\]]/, "@brackets"],
          { include: "@symbols" },
          [/[;,.]/, "delimiter"],
        ],

        numbers: [
          [/(?:(?:\d+\.\d*|\.\d+)(?:[eE][+-]?\d+)?|\d+[eE][+-]?\d+)[fF]?/, "number.float"],
          [/0[xX][0-9a-fA-F]+[uU]?/, "number.hex"],
          [/0[0-7]+[uU]?/, "number.octal"],
          [/\d+[uU]?/, "number"],
        ],

        symbols: [
          [
            /[=><!~?:&|+\-*\/\^%]+/,
            {
              cases: {
                "@operators": "operator",
                "@default": "",
              },
            },
          ],
        ],

        commentDecorators: [
          [/ *\u0040todo/i, "comment.todo"],
          [/ *\u0040note/i, "comment.note"],
        ],

        blockComment: [
          { include: "@commentDecorators" },

          [/[^\/*]+/, "comment"],
          [/\/\*/, "comment", "@push"],
          [/\*\//, "comment", "@pop"],
          [/[\/*]/, "comment"],
        ],

        lineComment: [
          [/^/, "@rematch", "@pop"],
          { include: "@commentDecorators" },
          [/.*/, "comment"],
        ],

        whitespace: [
          [/\s+/, "white"],
          [/\/\*/, "comment", "@blockComment"],
          [/\/\//, "comment", "@lineComment"],
        ],

        defineDirective: [
          [/^/, "@rematch", "@popall"],
          ["defined", "directive.defined"],
          { include: "@whitespace" },
          { include: "@symbols" },
          { include: "@numbers" },
          [/\w+/, "directive.macro"],
        ],

        directive: [
          [/^/, "@rematch", "@pop"],
          [/define|undef|if(?:n?def)?|elif/, "directive", "@defineDirective"],
          [/\b((?:end)?region)( +)(.+)/, ["directive", "whitespace", "string"]],
          [/\b(?:es)\b/, "string"],
          { include: "@numbers" },
          { include: "@whitespace" },
          [/\w+/, "directive"],
          [/"|</, { token: "string.quote", bracket: "@open", next: "@string" }],
        ],

        string: [
          [/[^">]+/, "string"],
          [/"|>/, { token: "string.quote", bracket: "@close", next: "@pop" }],
        ],
      },
    });

    if (hasModel) {
      const model = monaco.editor.getModel(options.model.uri || '');
      if (model) {
        options.model = model;
        options.model.setValue(this._value);
      } else {
        options.model = monaco.editor.createModel(options.model.value, options.model.language, options.model.uri);
      }
    }

    if (insideNg) {
      this._editor = monaco.editor.create(this.editorContainer.nativeElement, options);
    } else {
      this.zone.runOutsideAngular(() => {
        this._editor = monaco.editor.create(this.editorContainer.nativeElement, options);
      })
    }

    if (!hasModel) {
      this._editor.setValue(this._value);
    }

    this._editor.onDidChangeModelContent((e: any) => {
      const value = this._editor.getValue();

      // value is not propagated to parent when executing outside zone.
      this.zone.run(() => {
        this.propagateChange(value);
        this._value = value;
      });
    });

    this._editor.onDidBlurEditorWidget(() => {
      this.onTouched();
    });

    // refresh layout on resize event.
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    this._windowResizeSubscription = fromEvent(window, 'resize').subscribe(() => this._editor.layout());
  }
}