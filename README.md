# Dessin.js
Canvas를 활용하여 개발한 모바일용 그림 그리기 응용프로그램입니다.
[데모](http://webfrontend.github.io/Dessin/)에서 확인 하실 수 있습니다.


## 지원

* 모바일 지원(테스트 iOS 7.0.6, android 4.4)

## 기능

* 다양한 그리기 툴 제공(펜, 붓, 크래용, 에어브러쉬, 패턴)
* 페인트 툴 제공
* 텍스트 툴 제공
* 컬러 파레트와 피커 기능 제공
* 선택한 컬러 히스토리 저장 기능 제공
* 다중 레이어 제공
* 레이어 확대, 축소 및 이동 기능 제공
* 그림판의 히스토리 기능 제공


## 필수 환경 구성
1. [Git](http://git-scm.com/downloads)
2. [Node.js](http://nodejs.org/)
3. [Bower](http://bower.io/)
4. [Grunt](http://gruntjs.com/)


## 사용하기

Git 원격 저장소에서 내 컴퓨터 저장소로 해당 프로젝트를 복사한다.

`git clone https://github.com/WebFrontEnd/Dessin.git`

js 의존모듈들을 설치 한다.

`bower install`

# 빌드하기

Grunt 설치가 되어 있지 않다면 아래 명령어로 설치한다.

`npm install -g grunt-cli`

Grunt 의존 모듈들을 설치한다.

`npm install`

다음 명령어로 빌드한다.

`grunt`

빌드한 파일은 `dist` 폴더에 `Dessin.js`로 통합되며 `Dessin.min.js`로 압축된다.
