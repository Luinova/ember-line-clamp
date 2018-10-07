import { moduleForComponent, test, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { htmlSafe } from '@ember/string';

moduleForComponent('line-clamp', 'Integration | Component | line clamp', {
  integration: true
});

test('inline form works as expected', function(assert) {
  this.render(hbs`<div style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
    }}
  </div>`);

  const element = this.$()[0];
  const lines = Array.from(element.querySelectorAll('.lt-line-clamp__line'));
  const lastLine = lines[lines.length - 1];
  const lastLineChildren = lastLine.children;
  const ellipsisElement = lastLineChildren[0];
  const seeMoreButton = ellipsisElement.children[0];
  const dummyEllipsis = element.querySelectorAll('.lt-line-clamp--dummy');

  assert.ok(
    element,
    'line clamp target exists'
  );

  assert.equal(
    lines.length,
    3,
    'text is clamped at 3 lines (default)'
  );

  // This test a bit flaky, depends on the width of div and knowing 'helloworld helloworld' will be a line
  // assert.ok(
  //   lines.slice(0,2)
  //     .every((line) => line.innerText.trim() === 'helloworld helloworld'),
  //   'first lines contain expected text'
  // );

  // This is a better test since we know the truncation will push 'helloworld' to a new line if it does not fit
  assert.ok(
    lines.slice(0,2)
      .every((line) => line.innerText.trim().split(' ')[0] === 'helloworld'),
    'first lines contain expected text'
  );

  assert.ok(
    lastLine.classList.contains('lt-line-clamp__line--last'),
    'lt-line-clamp__line--last is applied to last line'
  );

  assert.equal(
    lastLineChildren.length,
    1,
    'last line contains 1 child'
  );

  assert.ok(
    ellipsisElement,
    'last line child is the ellipsis element and it exists'
  );

  assert.ok(
    ellipsisElement.classList.contains('lt-line-clamp__ellipsis'),
    'ellipsis element contains right CSS class'
  );

  assert.equal(
    ellipsisElement.innerText,
    '... See More',
    'Ellipsis element contains expetend ellipsis and see more text'
  );

  assert.ok(
    seeMoreButton,
    'see more button exists'
  );

  assert.ok(
    seeMoreButton.classList.contains('lt-line-clamp__more'),
    'see more button contains right CSS class'
  );

  assert.equal(
    seeMoreButton.innerText,
    'See More',
    'see more button contains expected text'
  );

  assert.ok(
    dummyEllipsis,
    'dummy ellipsis element exists'
  );

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld hellowor... See More'
  );

  seeMoreButton.click();

  const seeLessButton = element.querySelectorAll('.lt-line-clamp__less')[0];

  assert.ok(
    seeLessButton,
    'see less button exists'
  );

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld See Less'
  );
});

test('lines attribute works as expected', function(assert) {
  // Render component
  this.render(hbs`<div style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
      lines=2
    }}
  </div>`);

  const element = this.$()[0];
  const lines = Array.from(element.querySelectorAll('.lt-line-clamp__line'));
  const lastLine = lines[lines.length - 1];

  assert.ok(
    element,
    'line clamp target exists'
  );

  assert.equal(
    lines.length,
    2,
    'text is clamped at 2 lines specified by user'
  );

  assert.ok(
    lines.slice(0,1)
      .every((line) => line.innerText.trim().split(' ')[0] === 'helloworld'),
    'first lines contain expected text'
  );

  assert.ok(
    lastLine.classList.contains('lt-line-clamp__line--last'),
    'lt-line-clamp__line--last is applied to last line'
  );

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld hellowor... See More'
  );
});

test('ellipsis attribute works as expected', function(assert) {
  // Render component
  this.render(hbs`<div style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
      ellipsis="-"
    }}
  </div>`);

  const element = this.$()[0];
  const lines = Array.from(element.querySelectorAll('.lt-line-clamp__line'));
  const lastLine = lines[lines.length - 1];
  const lastLineChildren = lastLine.children;
  const ellipsisElement = lastLineChildren[0];

  assert.ok(
    element,
    'line clamp target exists'
  );

  assert.equal(
    ellipsisElement.innerText,
    '- See More',
    'Ellipsis element contains expetend ellipsis and see more text'
  );

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld helloworl- See More'
  );
});

test('interactive=false hides see more button', function(assert) {
  // Render component
  this.render(hbs`<div style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
      interactive=false
    }}
  </div>`);

  // We are running in headless chrome - it supports -webkit-line-clamp
  const element = this.$()[0];
  const lineClampElement = element.querySelectorAll('.lt-line-clamp');
  const lines = Array.from(element.querySelectorAll('.lt-line-clamp__line'));

  assert.ok(
    element,
    'line clamp target exists'
  );

  assert.equal(
    lineClampElement.length,
    1,
    'element fallbacks to -webkit-line-clamp'
  );

  assert.equal(
    lines.length,
    0,
    'No truncation happen, we use -webkit-line-clamp'
  );

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld'
  );
});

test('useJsOnly=true disables native CSS solution', function(assert) {
  // Render component
  this.render(hbs`<div style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
      interactive=false
      useJsOnly=true
    }}
  </div>`);

  // We are running in headless chrome - it supports -webkit-line-clamp
  const element = this.$()[0];
  const lineClampElement = element.querySelectorAll('.lt-line-clamp');
  const lines = Array.from(element.querySelectorAll('.lt-line-clamp__line'));

  assert.ok(
    element,
    'line clamp target exists'
  );

  assert.equal(
    lineClampElement.length,
    0,
    'element fallbacks to -webkit-line-clamp'
  );

  assert.equal(
    lines.length,
    3,
    'No truncation happen, we use -webkit-line-clamp'
  );

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld helloworld hellowor...'
  );
});

test('showMoreButton=false hides see more button', function(assert) {
  // Render component
  this.render(hbs`<div style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
      showMoreButton=false
    }}
  </div>`);

  // We are running in headless chrome - it supports -webkit-line-clamp
  const element = this.$()[0];
  const lineClampElement = element.querySelectorAll('.lt-line-clamp');
  const lines = Array.from(element.querySelectorAll('.lt-line-clamp__line'));

  assert.ok(
    element,
    'line clamp target exists'
  );

  assert.equal(
    lines.length,
    0,
    'No truncation happen, we use -webkit-line-clamp'
  );

  assert.equal(
    lineClampElement.length,
    1,
    'element fallbacks to -webkit-line-clamp'
  );

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld'
  );
});

test('showLessButton=false hides see less button', function(assert) {
  // Render component
  this.render(hbs`<div style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
      showLessButton=false
    }}
  </div>`);

  const element = this.$()[0];
  const lines = Array.from(element.querySelectorAll('.lt-line-clamp__line'));
  const lastLine = lines[lines.length - 1];
  const lastLineChildren = lastLine.children;
  const ellipsisElement = lastLineChildren[0];
  const seeMoreButton = ellipsisElement.children[0];

  assert.ok(
    element,
    'line clamp target exists'
  );

  assert.ok(
    seeMoreButton,
    'see more button exists'
  );

  seeMoreButton.click();

  const seeLessButton = element.querySelectorAll('.lt-line-clamp__less');

  assert.equal(
    seeLessButton.length,
    0,
    'see less button does not exist'
  );

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld'
  );
});

test('seeMoreText and seeLessText attributes work as expected', function(assert) {
  this.render(hbs`<div style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
      seeMoreText="Read More"
      seeLessText="Read Less"
    }}
  </div>`);

  const element = this.$()[0];
  const lines = Array.from(element.querySelectorAll('.lt-line-clamp__line'));
  const lastLine = lines[lines.length - 1];
  const lastLineChildren = lastLine.children;
  const ellipsisElement = lastLineChildren[0];
  const seeMoreButton = ellipsisElement.children[0];

  assert.ok(
    element,
    'line clamp target exists'
  );

  assert.ok(
    ellipsisElement,
    'last line child is the ellipsis element and it exists'
  );

  assert.ok(
    seeMoreButton,
    'see more button exists'
  );

  assert.equal(
    seeMoreButton.innerText,
    'Read More',
    'see more button contains expected text'
  );

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld hellow... Read More'
  );

  seeMoreButton.click();

  const seeLessButton = element.querySelectorAll('.lt-line-clamp__less')[0];

  assert.ok(
    seeLessButton,
    'see less button exists'
  );

  assert.equal(
    seeLessButton.innerText,
    'Read Less',
    'see less button contains expected text'
  );

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld Read Less'
  );
});

test('see more button is hidden if text is not long enough to truncate', function(assert) {
  // Render component
  this.render(hbs`<div style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text="helloworld helloworld"
    }}
  </div>`);

  const element = this.$()[0];
  const seeMoreButton = element.querySelectorAll('.lt-line-clamp__line .lt-line-clamp__more');

  assert.ok(
    element,
    'line clamp target exists'
  );

  assert.equal(
    seeMoreButton.length,
    0,
    'see more button is not needed'
  );

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld'
  );
});

test('clicking see more button toggles full text', function(assert) {
  this.render(hbs`<div style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
    }}
  </div>`);

  const element = this.$()[0];
  const lines = Array.from(element.querySelectorAll('.lt-line-clamp__line'));
  const lastLine = lines[lines.length - 1];
  const lastLineChildren = lastLine.children;
  const ellipsisElement = lastLineChildren[0];
  const seeMoreButton = ellipsisElement.children[0];

  assert.ok(
    element,
    'line clamp target exists'
  );

  assert.ok(
    seeMoreButton,
    'see more button exists'
  );

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld hellowor... See More'
  );

  seeMoreButton.click();

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld See Less'
  );
});

skip('resizing triggers component to re-truncate', function(assert) {
  assert.expect(4);
  const done = assert.async();

  this.render(hbs`<div id="test-conatiner" style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
    }}
  </div>`);

  const element = this.$()[0];
  const seeMoreButtonBeforeResize = element.querySelectorAll('.lt-line-clamp__line .lt-line-clamp__more');

  assert.ok(
    element,
    'line clamp target exists'
  );

  assert.equal(
    seeMoreButtonBeforeResize.length,
    1,
    'see more button exists'
  );

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld hellowor... See More'
  );

  // Mimic window resize
  element.querySelector('#test-conatiner').style.width = '960px';
  window.dispatchEvent(new CustomEvent('resize'));

  setTimeout(() => {
    const seeMoreButtonAfterResize = element.querySelectorAll('.lt-line-clamp__line .lt-line-clamp__more');

    assert.equal(
      seeMoreButtonAfterResize.length,
      0,
      'see more button does not exist'
    );

    done();
  }, 10);
  // const seeMoreButtonAfterResize = element.querySelectorAll('.lt-line-clamp__line .lt-line-clamp__more');

  // assert.equal(
  //   seeMoreButtonAfterResize.length,
  //   0,
  //   'see more button does not exist'
  // );

  // assert.equal(
  //   element.innerText.trim(),
  //   'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld'
  // );
});

test('clicking see more/see less button fires user defined action', function(assert) {
  assert.expect(5);

  this.on('assertOnExpand', () => assert.ok(true, 'onExpand action triggered'));
  this.set('assertOnCollapse', () => assert.ok(true, 'onCollapse action triggered'));

  this.render(hbs`<div id="test-conatiner" style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
      onExpand=(action "assertOnExpand")
      onCollapse=assertOnCollapse
    }}
  </div>`);

  const element = this.$()[0];
  const seeMoreButton = element.querySelectorAll('.lt-line-clamp__line .lt-line-clamp__more');

  assert.ok(
    element,
    'line clamp target exists'
  );

  assert.equal(
    seeMoreButton.length,
    1,
    'see more button exists'
  );

  seeMoreButton[0].click();

  const seeLessButton = element.querySelectorAll('.lt-line-clamp__less')[0];

  assert.ok(
    seeLessButton,
    'see less button exists'
  );

  seeLessButton.click();
});

test('clicking see more/see less buttons should not bubble event', function(assert) {
  assert.expect(3);

  this.on('assertOnParentAction', () => assert.ok(true, 'parent action should not be triggered'));
  this.on('assertOnParentClick', () => assert.ok(true, 'parent click action should not be triggered'));

  this.render(hbs`
    <div
      id="test-conatiner"
      style="width: 300px; font-size: 16px; font-family: sans-serif;"
      {{action "assertOnParentAction"}}
      onclick={{action "assertOnParentClick"}}
      >
      {{line-clamp
        text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
      }}
    </div>
  `);

  const element = this.$()[0];
  const seeMoreButton = element.querySelectorAll('.lt-line-clamp__line .lt-line-clamp__more');

  assert.ok(
    element,
    'line clamp target exists'
  );

  assert.equal(
    seeMoreButton.length,
    1,
    'see more button exists'
  );

  seeMoreButton[0].click();

  const seeLessButton = element.querySelectorAll('.lt-line-clamp__less')[0];

  assert.ok(
    seeLessButton,
    'see less button exists'
  );

  seeLessButton.click();
});

test('changing the component\'s text changes the component', function(assert) {
  assert.expect(2);

  this.set('textToTruncate', 'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld');

  this.render(hbs`<div id="test-conatiner" style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text=textToTruncate
    }}
  </div>`);

  const element = this.$()[0];
  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld hellowor... See More'
  );

  this.set('textToTruncate', 'helloworld helloworld helloworld helloworld');

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld'
  );
});

test('changing the component\'s lines changes the component', function(assert) {
  assert.expect(2);

  this.set('textToTruncate', 'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld');
  this.set('linesToTruncate', 3);

  this.render(hbs`<div id="test-conatiner" style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text=textToTruncate
      lines=linesToTruncate
    }}
  </div>`);

  const element = this.$()[0];
  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld hellowor... See More'
  );

  this.set('linesToTruncate', 2);

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld hellowor... See More'
  );
});

test('truncation can be controlled via the truncate attribute', function(assert) {
  assert.expect(3);

  this.set('textToTruncate', 'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld');
  this.set('truncate', true);

  this.render(hbs`<div id="test-conatiner" style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text=textToTruncate
      truncate=truncate
    }}
  </div>`);

  const element = this.$()[0];
  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld hellowor... See More'
  );

  this.set('truncate', false);

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld See Less'
  );

  this.set('truncate', true);

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld hellowor... See More'
  );
});

test('stripText correctly strips <br> tags', function(assert) {
  assert.expect(2);

  this.set('textToTruncate', htmlSafe('helloworld<br />helloworld<br />helloworld<br />helloworld'));
  this.set('truncate', true);
  this.set('stripText', true);

  this.render(hbs`<div id="test-conatiner" style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      truncate=truncate
      text=textToTruncate
      stripText=stripText
    }}
  </div>`);

  const element = this.$()[0];
  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld'
  );

  this.set('truncate', false);

  assert.equal(
    element.innerText.trim(),
    `helloworld
helloworld
helloworld
helloworld See Less`
  );
});

test('stripText correctly strips preserves newlines when stripText is false', function(assert) {
  assert.expect(2);

  this.set('textToTruncate', htmlSafe('helloworld<br />helloworld<br />helloworld<br />helloworld'));
  this.set('truncate', true);
  this.set('stripText', false);

  this.render(hbs`<div id="test-conatiner" style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      truncate=truncate
      text=textToTruncate
      stripText=stripText
    }}
  </div>`);

  const element = this.$()[0];
  assert.equal(
    element.innerText.trim(),
    `helloworld 
helloworld 
hellowor... See More`
  );

  this.set('truncate', false);

  assert.equal(
    element.innerText.trim(),
    `helloworld
helloworld
helloworld
helloworld See Less`
  );
});

test('Line clamp renders if content width is equal to zero', function(assert) {
  assert.expect(1);

  this.render(hbs`<div id="test-conatiner" style="width: 0px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
    }}
  </div>`);

  const element = this.$()[0];

  assert.ok(
    element,
    'line clamp target exists for element with width set at zero'
  );
});
